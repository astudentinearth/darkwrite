import { ParentId } from "@/common/note";
import { noteByParentIdTag, NOTES_TAG_TYPE, notesApi } from "./notes-api";
import { NoteDTO } from "@/common/dto";
import { DarkwriteAPIClient } from "@/api/api-client";
import i18n from "@/i18n";
import { upsertNotes } from "./note-slice";
import { navigateToNote } from "@/features/navigation/navigator";

export interface CreateNoteArgs {
  parentId?: ParentId;
  workspaceId: string;
  navigateAfter?: boolean;
}

async function _createNoteQueryFn(args: CreateNoteArgs) {
  try {
    const title = i18n.t("defaults.pageTitle");
    const { parentId, workspaceId } = args;
    const { note } = await DarkwriteAPIClient.note.create({
      parentId: parentId ?? null,
      workspaceId,
      title,
    });
    if (!note) throw new Error("Failed to create note");
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
}

async function _duplicateNoteQueryFn(noteId: string) {
  try {
    const { note } = await DarkwriteAPIClient.note.duplicate(noteId);
    if (!note) throw new Error("Failed to duplicate note");
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
}

export const createNoteApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    createNote: builder.mutation<NoteDTO, CreateNoteArgs>({
      queryFn: _createNoteQueryFn,

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: note } = await queryFulfilled;
          dispatch(upsertNotes([note]));
          if (args.navigateAfter) navigateToNote(note.id);
        } catch {
          /* empty */
        }
      },

      invalidatesTags: (_result, _error, args) => [
        {
          type: NOTES_TAG_TYPE,
          id: noteByParentIdTag(args.workspaceId, args.parentId ?? "ROOT"),
        },
      ],
    }),
    duplicateNote: builder.mutation<NoteDTO, string>({
      queryFn: _duplicateNoteQueryFn,

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

export const { useCreateNoteMutation } = createNoteApi;
