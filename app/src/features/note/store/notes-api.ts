import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NotesResponseDTO } from "@/common/dto";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertNotes } from "./note-slice";

export const NOTES_API_REDUCER_PATH = "notes-api";
export const NOTES_TAG_TYPE = "Note";

export function noteByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}`;
}

export function favoriteByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}_FAVORITES`;
}

export function noteByParentIdTag(
  workspaceId: string,
  parentId: string | null,
) {
  return `WORKSPACE_${workspaceId}_PARENT_${parentId ?? "ROOT"}`;
}

export function recentsByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}_RECENTS`;
}

const tryFetch = async (promise: Promise<NotesResponseDTO>) => {
  try {
    const { notes } = await promise;
    return {
      data: Object.values(notes),
    };
  } catch (error) {
    return { error: error as Error };
  }
};

export const notesApi = createApi({
  reducerPath: NOTES_API_REDUCER_PATH,
  baseQuery: fakeBaseQuery(),
  tagTypes: [NOTES_TAG_TYPE],
  endpoints: (builder) => ({
    getNotesByParentId: builder.query<
      NoteDTO[],
      { parentId: string | null; workspaceId: string }
    >({
      queryFn: ({ parentId, workspaceId }) =>
        tryFetch(DarkwriteAPIClient.note.getByParentId(workspaceId, parentId)),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch {
          /* empty */
        }
      },

      providesTags: (result, _error, args) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: noteByParentIdTag(args.workspaceId, args.parentId),
              },
            ]
          : [],
    }),

    getFavoritesByWorkspaceId: builder.query<NoteDTO[], string>({
      queryFn: (workspaceId) =>
        tryFetch(DarkwriteAPIClient.note.getFavorites(workspaceId)),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch {
          /* empty */
        }
      },

      providesTags: (result, _error, workspaceId) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: favoriteByWorkspaceIdTag(workspaceId),
              },
            ]
          : [],
    }),

    getRecentsByWorkspaceId: builder.query<NoteDTO[], string>({
      queryFn: (workspaceId) =>
        tryFetch(DarkwriteAPIClient.note.getRecents(workspaceId)),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch {
          /* empty */
        }
      },

      providesTags: (result, _error, workspaceId) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: recentsByWorkspaceIdTag(workspaceId),
              },
            ]
          : [],
    }),
  }),
});

export const {
  useGetNotesByParentIdQuery,
  useGetRecentsByWorkspaceIdQuery,
  useGetFavoritesByWorkspaceIdQuery,
} = notesApi;
