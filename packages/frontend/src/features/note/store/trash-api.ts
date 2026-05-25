import { DarkwriteAPIClient } from "@/api/api-client";
import { resultQueryFn } from "@/lib/query-result";
import { NOTES_TAG_TYPE, notesApi } from "./notes-api";
import { removeNote, removeNotes, updateNote, upsertNotes } from "./note-slice";
import { NoteDTO } from "@darkwrite/common";
import { MutationError } from "@darkwrite/common";
import { RootState } from "@/features/store/types";
import { selectNoteIdsInTrash } from "./note-selectors";

export function trashedByWorkspaceIdTag(workspaceId: string) {
  return `TRASHED_BY_WORKSPACE_ID_${workspaceId}` as const;
}

export function trashedByNoteIdTag(noteId: string) {
  return `TRASHED_BY_NOTE_ID_${noteId}` as const;
}

export const _moveToTrashMutationFn = async (noteId: string) => {
  try {
    const { note } = await DarkwriteAPIClient.note.moveToTrash(noteId);
    if (!note) throw new MutationError("Note not found");
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
};

export const _restoreFromTrashMutationFn = async (noteId: string) => {
  try {
    const { note } = await DarkwriteAPIClient.note.restoreFromTrash(noteId);
    if (!note) throw new MutationError("Note not found");
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
};

export const _clearTrashMutationFn = async (workspaceId: string) => {
  try {
    await DarkwriteAPIClient.note.clearTrash(workspaceId);
    return { data: true as const };
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

      queryFn: resultQueryFn(
        (workspaceId: string) =>
          DarkwriteAPIClient.note.getTrashed(workspaceId),
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
    }),

    moveToTrash: builder.mutation<NoteDTO, string>({
      queryFn: _moveToTrashMutationFn,
      onQueryStarted: async (noteId, { dispatch, queryFulfilled }) => {
        const changes: Partial<NoteDTO> = { isTrashed: true };
        const undoPatch: Partial<NoteDTO> = { isTrashed: false };

        dispatch(updateNote({ id: noteId, changes }));

        try {
          const { data } = await queryFulfilled;
          if (!data) throw new MutationError("Update failed");
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
          if (!data) throw new MutationError("Update failed");
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

    delete: builder.mutation<true, string>({
      queryFn: async (noteId) => {
        try {
          await DarkwriteAPIClient.note.delete(noteId);
          return { data: true as const };
        } catch (error) {
          return { error: error as Error };
        }
      },
      onQueryStarted: async (
        noteId,
        { dispatch, queryFulfilled, getState },
      ) => {
        const note = (getState() as RootState)["notes-slice"].entities[noteId];

        if (note) {
          dispatch(removeNote(noteId));
        }

        try {
          await queryFulfilled;
        } catch {
          if (note) dispatch(upsertNotes([note]));
        }
      },
    }),

    clearTrash: builder.mutation<true, string>({
      queryFn: _clearTrashMutationFn,
      onQueryStarted: async (
        workspaceId,
        { dispatch, queryFulfilled, getState },
      ) => {
        try {
          const state = getState() as RootState;
          const notes = selectNoteIdsInTrash(state, workspaceId);
          await queryFulfilled;
          dispatch(removeNotes(notes));
        } catch {
          /* empty */
        }
      },
      invalidatesTags: (_result, _error, workspaceId) => [
        { type: NOTES_TAG_TYPE, id: trashedByWorkspaceIdTag(workspaceId) },
      ],
    }),
  }),
});

export const {
  useGetTrashedQuery,
  useDeleteMutation,
  useMoveToTrashMutation,
  useRestoreFromTrashMutation,
  useClearTrashMutation,
} = trashApi;
