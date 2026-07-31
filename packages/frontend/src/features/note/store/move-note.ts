import {
  dwErrAsync,
  isDescendant,
  type NoteDTO,
  type ParentId,
} from "@darkwrite/common";
import { okAsync } from "neverthrow";
import type { DragEvent } from "react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { extractNoteDragData } from "@/features/dnd/datatransfer";
import type { RootState } from "@/features/store/types";
import { resultQueryFn } from "@/lib/query-result";
import {
  calculateOptimisticRankInLayer,
  calculateRelativeOptimisticRank,
} from "./note-rank-optimistic";
import { selectNoteById, selectNoteIdsByParentId } from "./note-selectors";
import { updateNote, upsertNotes } from "./note-slice";
import { NOTES_TAG_TYPE, noteByParentIdTag, notesApi } from "./notes-api";

export type MoveNoteBelowArgs = {
  sourceNoteId: string;
  aboveNoteId: string;
};

/**
 * Moves the note into a tree level without specifying
 * an order relative to another note. This can also be used to
 * move notes to start or end within the same tree level.
 */
export type MoveNoteIntoArgs = {
  sourceNoteId: string;
  destinationNoteId: ParentId;
  placement: "inside-start" | "inside-end";
};

export function getMovingNote(e: DragEvent<HTMLElement>, state: RootState) {
  const sourceId = extractNoteDragData(e)?.noteId;
  if (!sourceId) return;
  const movingNote = selectNoteById(state, sourceId);
  return movingNote ?? null;
}

export const moveNoteApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    moveBelow: builder.mutation<NoteDTO, MoveNoteBelowArgs>({
      queryFn: resultQueryFn(
        ({ aboveNoteId, sourceNoteId }: MoveNoteBelowArgs) =>
          DarkwriteAPIClient.note
            .move({
              destinationId: aboveNoteId,
              placement: "below",
              sourceId: sourceNoteId,
            })
            .andThen(({ note }) =>
              note ? okAsync(note) : dwErrAsync("Failed to move note"),
            ),
      ),

      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;

        const { aboveNoteId, sourceNoteId } = args;
        const aboveNote = selectNoteById(state, aboveNoteId);
        const sourceNote = selectNoteById(state, sourceNoteId);

        if (!aboveNote || !sourceNote) return;
        const siblings = selectNoteIdsByParentId(
          state,
          aboveNote.workspaceId,
          aboveNote.parentId,
        );

        const newOrderHint = calculateRelativeOptimisticRank(
          aboveNoteId,
          siblings,
          (id: string) => selectNoteById(state, id),
        );

        const undoPatch: Partial<NoteDTO> = {
          parentId: sourceNote.parentId,
          orderHint: sourceNote.orderHint,
        };

        const changes: Partial<NoteDTO> = {
          parentId: aboveNote.parentId,
          orderHint: newOrderHint,
        };

        dispatch(
          updateNote({
            id: sourceNoteId,
            changes,
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes([data]));
        } catch {
          dispatch(
            updateNote({
              id: sourceNoteId,
              changes: undoPatch,
            }),
          );
        }
      },

      invalidatesTags: (_result, error) => {
        if (error) {
          return [NOTES_TAG_TYPE];
        }
        return [
          {
            type: NOTES_TAG_TYPE,
            // biome-ignore lint/style/noNonNullAssertion: error check
            id: noteByParentIdTag(_result!.workspaceId, _result!.parentId),
          },
          {
            type: NOTES_TAG_TYPE,
            // biome-ignore lint/style/noNonNullAssertion: error check
            id: noteByParentIdTag(_result!.workspaceId, _result!.id),
          },
        ];
      },
    }),
  }),
  overrideExisting: false,
});

export const { useMoveBelowMutation } = moveNoteApi;
