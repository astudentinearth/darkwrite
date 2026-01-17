import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO } from "@/common/dto";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertNotes } from "./note-slice";

export const NOTES_API_REDUCER_PATH = "notes-api";
export const NOTES_TAG_TYPE = "Note";
export function noteByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}`;
}

export const notesApi = createApi({
  reducerPath: NOTES_API_REDUCER_PATH,
  baseQuery: fakeBaseQuery(),
  tagTypes: [NOTES_TAG_TYPE],
  endpoints: (builder) => ({
    getNotesByWorkspace: builder.query<NoteDTO[], string>({
      async queryFn(workspaceId) {
        try {
          const { notes } =
            await DarkwriteAPIClient.note.getAllByWorkspaceId(workspaceId);
          return {
            data: Object.values(notes),
          };
        } catch (error) {
          return { error: error as Error };
        }
      },

      async onQueryStarted(workspaceId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch (err) {
          console.error("Fetch failed: ", err);
        }
      },

      providesTags: (result, error, workspaceId) =>
        result
          ? [{ type: NOTES_TAG_TYPE, id: noteByWorkspaceIdTag(workspaceId) }]
          : [],
    }),
  }),
});
