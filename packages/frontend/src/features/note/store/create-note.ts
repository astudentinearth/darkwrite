import { dwErrAsync, type NoteDTO } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import { navigateToNote } from "@/features/navigation/navigator";
import { resultQueryFn } from "@/lib/query-result";
import { upsertNotes } from "./note-slice";
import { NOTES_TAG_TYPE, noteByParentIdTag, notesApi } from "./notes-api";

export const createNoteApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    duplicateNote: builder.mutation<NoteDTO, string>({
      queryFn: resultQueryFn((noteId: string) =>
        DarkwriteAPIClient.note
          .duplicate(noteId)
          .andThen(({ note }) =>
            note ? okAsync(note) : dwErrAsync("Failed to duplicate note"),
          ),
      ),

      async onQueryStarted(_noteId, { dispatch, queryFulfilled }) {
        try {
          const { data: note } = await queryFulfilled;
          dispatch(upsertNotes([note]));
          navigateToNote(note.id);
        } catch {
          /* empty */
        }
      },

      invalidatesTags: (result) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: noteByParentIdTag(result.workspaceId, result.parentId),
              },
            ]
          : [],
    }),
  }),
});
