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
import { selectNoteById } from "./note-selectors";
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
    moveInto: builder.mutation<NoteDTO, MoveNoteIntoArgs>({
      queryFn: resultQueryFn(
        ({ destinationNoteId, placement, sourceNoteId }: MoveNoteIntoArgs) =>
          DarkwriteAPIClient.note
            .move({
              destinationId: destinationNoteId,
              placement,
              sourceId: sourceNoteId,
            })
            .andThen(({ note }) =>
              note ? okAsync(note) : dwErrAsync("Failed to move note"),
            ),
      ),

      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const note = selectNoteById(state, args.sourceNoteId);
        if (!note) return;

        if (
          isDescendant(
            args.destinationNoteId ?? "",
            args.sourceNoteId,
            state["notes-slice"].entities,
          )
        ) {
          // Prevent moving a note into its own descendant
          return;
        }

        const undoPatch: Partial<NoteDTO> = {
          parentId: note.parentId,
        };

        dispatch(
          updateNote({
            id: args.sourceNoteId,
            changes: {
              parentId: args.destinationNoteId,
            },
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

        const undoPatch: Partial<NoteDTO> = {
          parentId: sourceNote.parentId,
        };

        const changes: Partial<NoteDTO> = {
          parentId: aboveNote.parentId,
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

export const { useMoveIntoMutation, useMoveBelowMutation } = moveNoteApi;
