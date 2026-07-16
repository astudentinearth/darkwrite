import { dwErrAsync, isDescendant, type NoteDTO } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import type { DragEvent } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { extractNoteDragData } from "@/features/dnd/datatransfer";
import type { RootState } from "@/features/store/types";
import { resultQueryFn } from "@/lib/query-result";
import { selectNoteById } from "./note-selectors";
import { updateNote, upsertNotes } from "./note-slice";
import { NOTES_TAG_TYPE, notesApi } from "./notes-api";

export type MoveNoteArgs = {
  sourceNoteId: string;
  parentId: string | null;
};

export function getMovingNote(e: DragEvent<HTMLElement>, state: RootState) {
  const sourceId = extractNoteDragData(e)?.noteId;
  if (!sourceId) return;
  const movingNote = selectNoteById(state, sourceId);
  return movingNote ?? null;
}

export const moveNoteApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    moveNote: builder.mutation<NoteDTO, MoveNoteArgs>({
      queryFn: resultQueryFn(({ sourceNoteId, parentId }: MoveNoteArgs) =>
        DarkwriteAPIClient.note
          .move({ sourceId: sourceNoteId, parentId })
          .andThen(({ note }) =>
            note ? okAsync(note) : dwErrAsync("Failed to move note"),
          ),
      ),

      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const note = selectNoteById(state, args.sourceNoteId);
        if (!note) return;

        if (
          args.parentId &&
          isDescendant(
            args.parentId,
            args.sourceNoteId,
            state["notes-slice"].entities,
          )
        ) {
          return;
        }

        const undoPatch: Partial<NoteDTO> = {
          parentId: note.parentId,
        };

        dispatch(
          updateNote({
            id: args.sourceNoteId,
            changes: { parentId: args.parentId },
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes([data]));
        } catch {
          dispatch(
            updateNote({
              id: args.sourceNoteId,
              changes: undoPatch,
            }),
          );
        }
      },

      invalidatesTags: (_result, error) => {
        if (error) {
          return [NOTES_TAG_TYPE];
        }
        return [];
      },
    }),
  }),
  overrideExisting: false,
});

export const { useMoveNoteMutation } = moveNoteApi;
