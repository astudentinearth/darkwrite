import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";
import type { NoteContent } from "@darkwrite/common";
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
      queryFn: resultQueryFn(
        (noteId: string) => DarkwriteAPIClient.note.getDocument(noteId),
        (r) => r.document,
      ),

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

export const { useGetDocumentQuery } = editorApi;
