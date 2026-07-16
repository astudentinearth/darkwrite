import {
  dwErrAsync,
  type GetNotesInDatabaseResponse,
  type NoteDTO,
} from "@darkwrite/common";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";
import { upsertNotes } from "./note-slice";

export const NOTES_API_REDUCER_PATH = "notes-api";
export const NOTES_TAG_TYPE = "Note";

export function noteByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}`;
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

export function parentTreeTag(noteId: string) {
  return `PARENT_TREE_${noteId}`;
}

export function noteByIdTag(noteId: string) {
  return `NOTE_${noteId}`;
}

export function notesInDatabaseTag(databaseId: string) {
  return `DATABASE_NOTES_${databaseId}`;
}

export const notesApi = createApi({
  reducerPath: NOTES_API_REDUCER_PATH,
  baseQuery: fakeBaseQuery(),
  tagTypes: [NOTES_TAG_TYPE],
  endpoints: (builder) => ({
    getNotesByParentId: builder.query<
      NoteDTO[],
      { parentId: string | null; workspaceId: string }
    >({
      queryFn: resultQueryFn(
        ({ parentId, workspaceId }) =>
          DarkwriteAPIClient.note.getByParentId(workspaceId, parentId),
        (r) => Object.values(r.notes),
      ),

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

    getParentTree: builder.query<NoteDTO[], string>({
      queryFn: resultQueryFn(
        (noteId: string) => DarkwriteAPIClient.note.getParentTree(noteId),
        (r) => r.parents,
      ),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch {
          /* empty */
        }
      },

      providesTags: (result, _error, noteId) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: parentTreeTag(noteId),
              },
            ]
          : [],
    }),

    getNoteById: builder.query<NoteDTO, string>({
      queryFn: resultQueryFn((noteId: string) =>
        DarkwriteAPIClient.note
          .getById(noteId)
          .andThen(({ note }) =>
            note ? okAsync(note) : dwErrAsync("Note not found"),
          ),
      ),

      onQueryStarted: async (_noteId: string, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes([data]));
        } catch {
          /* empty */
        }
      },

      providesTags: (result, _error, noteId) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: noteByIdTag(noteId),
              },
            ]
          : [],
    }),

    getRecentsByWorkspaceId: builder.query<NoteDTO[], string>({
      queryFn: resultQueryFn(
        (workspaceId: string) =>
          DarkwriteAPIClient.note.getRecents(workspaceId),
        (r) => Object.values(r.notes),
      ),

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

    getNotesInDatabase: builder.query<GetNotesInDatabaseResponse, string>({
      queryFn: resultQueryFn((databaseId: string) =>
        DarkwriteAPIClient.database.getNotesInDatabase(databaseId),
      ),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(upsertNotes(data.notes));
        } catch {
          /* empty */
        }
      },

      providesTags: (result, _error, databaseId) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: notesInDatabaseTag(databaseId),
              },
            ]
          : [],
    }),

    getDatabasesInWorkspace: builder.query<NoteDTO[], string>({
      queryFn: resultQueryFn(
        (workspaceId: string) =>
          DarkwriteAPIClient.database.getAllDatabasesInWorkspace(workspaceId),
        (r) => Object.values(r.notes),
      ),

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
                id: noteByWorkspaceIdTag(workspaceId),
              },
            ]
          : [],
    }),
  }),
});

export const {
  useGetNotesByParentIdQuery,
  useGetRecentsByWorkspaceIdQuery,
  useGetNoteByIdQuery,
  useGetNotesInDatabaseQuery,
  useGetDatabasesInWorkspaceQuery,
} = notesApi;
