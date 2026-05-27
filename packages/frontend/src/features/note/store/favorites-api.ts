import { dwErrAsync, type NoteDTO, Rank } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { RootState } from "@/features/store/types";
import { resultQueryFn } from "@/lib/query-result";
import { selectFavorites, selectNoteById } from "./note-selectors";
import { updateNote } from "./note-slice";
import { notesApi } from "./notes-api";

export type FavoriteNoteArgs = { noteId: string; aboveNoteId?: string | null };

function computeOptimisticFavoriteOrderHint(
  favorites: NoteDTO[],
  aboveNoteId?: string | null,
) {
  if (favorites.length === 0) return Rank.default().get();
  const sorted = favorites.toSorted((a, b) =>
    Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint),
  );
  if (aboveNoteId === null) {
    return new Rank(sorted[0].favoriteOrderHint).prev().get();
  }
  if (aboveNoteId === undefined) {
    return new Rank(sorted[sorted.length - 1].favoriteOrderHint).next().get();
  }
  const aboveIndex = sorted.findIndex((n) => n.id === aboveNoteId);
  if (aboveIndex === -1 || aboveIndex + 1 >= sorted.length) {
    return new Rank(sorted[sorted.length - 1].favoriteOrderHint).next().get();
  }
  const aboveFavorite = sorted[aboveIndex];
  const belowFavorite = sorted[aboveIndex + 1];
  const rank = new Rank(aboveFavorite.favoriteOrderHint).between(
    new Rank(belowFavorite.favoriteOrderHint),
  );
  return rank.get();
}

export const favoritesApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    favorite: builder.mutation<NoteDTO, FavoriteNoteArgs>({
      queryFn: resultQueryFn(({ noteId, aboveNoteId }: FavoriteNoteArgs) =>
        DarkwriteAPIClient.note
          .favorite(noteId, aboveNoteId)
          .andThen(({ note }) =>
            note ? okAsync(note) : dwErrAsync("Note not found"),
          ),
      ),

      onQueryStarted: async (args, { dispatch, getState, queryFulfilled }) => {
        const state = getState() as RootState;
        const note = selectNoteById(state, args.noteId);
        const favorites = selectFavorites(state, note.workspaceId);
        const favoriteOrderHint = computeOptimisticFavoriteOrderHint(
          favorites,
          args.aboveNoteId,
        );

        const changes: Partial<NoteDTO> = {
          isFavorite: true,
          favoriteOrderHint,
        };

        const undoPatch: Partial<NoteDTO> = {
          isFavorite: false,
          favoriteOrderHint: "",
        };

        dispatch(updateNote({ id: args.noteId, changes }));

        try {
          const result = await queryFulfilled;
          const updatedNote = result.data;
          dispatch(updateNote({ id: args.noteId, changes: updatedNote }));
        } catch (error) {
          dispatch(updateNote({ id: args.noteId, changes: undoPatch }));
          console.error(error);
        }
      },
    }),

    unfavorite: builder.mutation<NoteDTO, string>({
      queryFn: resultQueryFn((noteId: string) =>
        DarkwriteAPIClient.note
          .unfavorite(noteId)
          .andThen(({ note }) =>
            note ? okAsync(note) : dwErrAsync("Note not found"),
          ),
      ),

      onQueryStarted: async (
        noteId,
        { dispatch, getState, queryFulfilled },
      ) => {
        const state = getState() as RootState;
        const note = selectNoteById(state, noteId);

        const changes: Partial<NoteDTO> = {
          isFavorite: false,
          favoriteOrderHint: "",
        };

        const undoPatch: Partial<NoteDTO> = {
          isFavorite: true,
          favoriteOrderHint: note.favoriteOrderHint,
        };

        dispatch(updateNote({ id: noteId, changes }));

        try {
          const result = await queryFulfilled;
          const updatedNote = result.data;
          dispatch(updateNote({ id: noteId, changes: updatedNote }));
        } catch (error) {
          dispatch(updateNote({ id: noteId, changes: undoPatch }));
          console.error(error);
        }
      },
    }),
  }),
});

export const { useFavoriteMutation } = favoritesApi;
