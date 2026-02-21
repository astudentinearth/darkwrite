import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteContent } from "@/common/note-content";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { editorSlice } from "./editor-slice";

export const EDITOR_API_NAME = "editorApi";

export const EDITOR_API_TAG_TYPE = "Editor" as const;
export function documentByIdTag(noteId: string): {
  type: typeof EDITOR_API_TAG_TYPE;
  id: string;
} {
  return {
    type: EDITOR_API_TAG_TYPE,
    id: `DOCUMENT-${noteId}`,
  };
}

export const editorApi = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: EDITOR_API_NAME,
  tagTypes: [EDITOR_API_TAG_TYPE],
  endpoints: (builder) => ({
    getDocument: builder.query<NoteContent, string>({
      queryFn: async (noteId: string) => {
        try {
          const { document } =
            await DarkwriteAPIClient.note.getDocument(noteId);
          return { data: document };
        } catch (e) {
          return { error: e instanceof Error ? e : new Error("Unknown error") };
        }
      },

      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const data = await queryFulfilled;
          dispatch(
            editorSlice.actions.initializeDocument({
              noteId: args,
              document: data.data,
            }),
          );
        } catch (e) {
          console.error("Failed to fetch document:", e);
        }
      },

      providesTags: (_result, _error, noteId) => [documentByIdTag(noteId)],
    }),
  }),
});
