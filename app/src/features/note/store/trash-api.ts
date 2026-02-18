import { DarkwriteAPIClient } from "@/api/api-client";
import { _tryFetch, NOTES_TAG_TYPE, notesApi } from "./notes-api";
import { updateNote, upsertNotes } from "./note-slice";
import { NoteDTO } from "@/common/dto";

export function trashedByWorkspaceIdTag(workspaceId: string) {
  return `TRASHED_BY_WORKSPACE_ID_${workspaceId}` as const;
}

export function trashedByNoteIdTag(noteId: string) {
  return `TRASHED_BY_NOTE_ID_${noteId}` as const;
}

export const _moveToTrashMutationFn = async (noteId: string) => {
  try {
    const { note } = await DarkwriteAPIClient.note.moveToTrash(noteId);
    if (!note) throw new Error("Note not found");
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
};

export const _restoreFromTrashMutationFn = async (noteId: string) => {
  try {
    const { note } = await DarkwriteAPIClient.note.restoreFromTrash(noteId);
    if (!note) throw new Error("Note not found");
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
};

export const trashApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrashed: builder.query<NoteDTO[], string>({
      providesTags: (result, _error, workspaceId) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: trashedByWorkspaceIdTag(workspaceId),
              },
            ]
          : [],

      queryFn: (workspaceId) =>
        _tryFetch(DarkwriteAPIClient.note.getTrashed(workspaceId)),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch {
          /* empty */
        }
      },
    }),

    moveToTrash: builder.mutation<NoteDTO, string>({
      queryFn: _moveToTrashMutationFn,
      onQueryStarted: async (noteId, { dispatch, queryFulfilled }) => {
        const changes: Partial<NoteDTO> = { isTrashed: true };
        const undoPatch: Partial<NoteDTO> = { isTrashed: false };

        dispatch(updateNote({ id: noteId, changes }));

        try {
          const { data } = await queryFulfilled;
          if (!data) throw new Error("Update failed");
          dispatch(upsertNotes([data]));
        } catch {
          dispatch(updateNote({ id: noteId, changes: undoPatch }));
          /* empty */
        }
      },
      invalidatesTags: (result, _error, noteId) => [
        {
          type: NOTES_TAG_TYPE,
          id: trashedByNoteIdTag(noteId),
        },
      ],
    }),

    restoreFromTrash: builder.mutation<NoteDTO, string>({
      queryFn: _restoreFromTrashMutationFn,
      onQueryStarted: async (_noteId, { dispatch, queryFulfilled }) => {
        //TODO: implement optimistic update later

        try {
          const { data } = await queryFulfilled;
          if (!data) throw new Error("Update failed");
          dispatch(upsertNotes([data]));
        } catch {
          /* empty */
        }
      },
      invalidatesTags: (_result, _error, noteId) => [
        {
          type: NOTES_TAG_TYPE,
          id: trashedByNoteIdTag(noteId),
        },
      ],
    }),
  }),
});

export const { useGetTrashedQuery } = trashApi;
