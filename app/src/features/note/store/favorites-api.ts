import { NoteDTO } from "@/common/dto";
import { notesApi } from "./notes-api";
import { DarkwriteAPIClient } from "@/api/api-client";
import { Rank } from "@/common/rank";
import {
  selectFavoriteIds,
  selectFavorites,
  selectNoteById,
} from "./note-selectors";
import { RootState } from "@/features/store/redux";
import { updateNote } from "./note-slice";

export type FavoriteNoteArgs = { noteId: string; aboveNoteId?: string | null };

async function _favoriteNoteMutationFn({
  noteId,
  aboveNoteId,
}: FavoriteNoteArgs) {
  try {
    const { note } = await DarkwriteAPIClient.note.favorite(
      noteId,
      aboveNoteId,
    );
    if (!note) throw new Error("Note not found");
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
}

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
      queryFn: _favoriteNoteMutationFn,

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
  }),
});

export const { useFavoriteMutation } = favoritesApi;
