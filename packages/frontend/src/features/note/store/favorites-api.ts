import type { FavoriteActionResponse } from "@darkwrite/common";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { RootState } from "@/features/store/types";
import { workspaceSlice } from "@/features/workspaces/store/workspace-slice";
import { resultQueryFn } from "@/lib/query-result";
import { selectNoteById } from "./note-selectors";
import { notesApi } from "./notes-api";

export type FavoriteNoteArgs = { noteId: string; aboveId?: string | null };

function computeInsertAtIndex(
  favoriteIds: string[],
  aboveId: string | null | undefined,
): number | undefined {
  if (aboveId === null) return 0;
  if (aboveId != null) {
    const idx = favoriteIds.indexOf(aboveId);
    return idx >= 0 ? idx + 1 : favoriteIds.length;
  }
  return undefined;
}

export const favoritesApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    favorite: builder.mutation<FavoriteActionResponse, FavoriteNoteArgs>({
      queryFn: async ({ noteId, aboveId }, api) => {
        console.log(`adding ${noteId} to favorites`);
        const state = api.getState() as RootState;
        const note = selectNoteById(state, noteId);
        const workspace = note
          ? state.workspace.workspaces[note.workspaceId]
          : undefined;
        const favoriteIds = workspace?.favoriteIds ?? [];
        const insertAtIndex = computeInsertAtIndex(favoriteIds, aboveId);
        return DarkwriteAPIClient.note
          .favorite(noteId, insertAtIndex)
          .orTee(console.error)
          .match(
            (value) => ({ data: value }),
            (error) => ({ error }),
          );
      },

      onQueryStarted: async (
        { noteId, aboveId },
        { dispatch, getState, queryFulfilled },
      ) => {
        const state = getState() as RootState;
        const note = selectNoteById(state, noteId);
        if (!note) return;

        const workspace = state.workspace.workspaces[note.workspaceId];
        if (!workspace) return;

        const ids = [...workspace.favoriteIds];
        const insertAtIndex = computeInsertAtIndex(ids, aboveId);

        if (insertAtIndex != null) {
          const existingIndex = ids.indexOf(noteId);
          if (existingIndex !== -1) ids.splice(existingIndex, 1);
          const insertAt = Math.min(insertAtIndex, ids.length);
          ids.splice(insertAt, 0, noteId);
        } else {
          if (!ids.includes(noteId)) ids.push(noteId);
        }

        const undo = workspace.favoriteIds;

        dispatch(
          workspaceSlice.actions.setWorkspaceFavorites({
            id: workspace.id,
            ids,
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            workspaceSlice.actions.setWorkspaceFavorites({
              id: workspace.id,
              ids: data.favoriteIds,
            }),
          );
        } catch (error) {
          dispatch(
            workspaceSlice.actions.setWorkspaceFavorites({
              id: workspace.id,
              ids: undo,
            }),
          );
          console.error(error);
        }
      },
    }),

    unfavorite: builder.mutation<FavoriteActionResponse, string>({
      queryFn: resultQueryFn((noteId: string) =>
        DarkwriteAPIClient.note.unfavorite(noteId),
      ),

      onQueryStarted: async (
        noteId,
        { dispatch, getState, queryFulfilled },
      ) => {
        const state = getState() as RootState;
        const note = selectNoteById(state, noteId);
        if (!note) return;

        const workspace = state.workspace.workspaces[note.workspaceId];
        if (!workspace) return;

        const ids = workspace.favoriteIds.filter((id) => id !== noteId);
        const undo = workspace.favoriteIds;

        dispatch(
          workspaceSlice.actions.setWorkspaceFavorites({
            id: workspace.id,
            ids,
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            workspaceSlice.actions.setWorkspaceFavorites({
              id: workspace.id,
              ids: data.favoriteIds,
            }),
          );
        } catch (error) {
          dispatch(
            workspaceSlice.actions.setWorkspaceFavorites({
              id: workspace.id,
              ids: undo,
            }),
          );
          console.error(error);
        }
      },
    }),
  }),
});

export const { useFavoriteMutation } = favoritesApi;
