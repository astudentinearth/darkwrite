import {
  type CreateDatabaseArgs,
  type CreateDatabaseResponse,
  dwErrAsync,
  type NoteDTO,
  type ParentId,
} from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "@/api/api-client";
import { upsertViews } from "@/features/database/store/database-view-slice";
import { navigateToNote } from "@/features/navigation/navigator";
import { resultQueryFn } from "@/lib/query-result";
import { upsertNotes } from "./note-slice";
import { NOTES_TAG_TYPE, noteByParentIdTag, notesApi } from "./notes-api";

export interface CreateNoteArgs {
  parentId?: ParentId;
  workspaceId: string;
  navigateAfter?: boolean;
}

export const createNoteApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    createNote: builder.mutation<NoteDTO, CreateNoteArgs>({
      queryFn: resultQueryFn(({ parentId, workspaceId }: CreateNoteArgs) =>
        DarkwriteAPIClient.note
          .create({ parentId: parentId ?? null, workspaceId, title: "" })
          .andThen(({ note }) =>
            note ? okAsync(note) : dwErrAsync("Failed to create note"),
          ),
      ),

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

    createDatabase: builder.mutation<
      CreateDatabaseResponse,
      CreateDatabaseArgs
    >({
      queryFn: resultQueryFn((args) =>
        DarkwriteAPIClient.note.createDatabase(args),
      ),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes([...data.views, data.database]));
          dispatch(upsertViews(data.viewMetadata));
        } catch {}
      },
    }),

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

export const { useCreateNoteMutation } = createNoteApi;
