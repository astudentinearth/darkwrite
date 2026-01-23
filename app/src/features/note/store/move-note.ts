import { NoteDTO } from "@/common/dto";
import { NOTES_TAG_TYPE, notesApi } from "./notes-api";
import { DarkwriteAPIClient } from "@/api/api-client";
import { isDescendant, ParentId } from "@/common/note";
import { Rank } from "@/common/rank";
import { selectNoteById, selectNotesByParentId } from "./note-selectors";
import { updateNote, upsertNotes } from "./note-slice";
import { RootState } from "@/features/store/redux";
import { calculateOptimisticRankInLayer } from "./note-rank-optimistic";

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

const _moveNoteIntoQueryFn = async ({
  destinationNoteId,
  placement,
  sourceNoteId,
}: MoveNoteIntoArgs) => {
  try {
    const { note } = await DarkwriteAPIClient.note.move({
      destinationId: destinationNoteId,
      placement,
      sourceId: sourceNoteId,
    });
    if (!note) {
      throw new Error("Failed to move note");
    }
    return { data: note };
  } catch (error) {
    return { error: error as Error };
  }
};

export const moveNoteApi = notesApi.injectEndpoints({
  endpoints: (builder) => ({
    moveInto: builder.mutation<NoteDTO, MoveNoteIntoArgs>({
      queryFn: _moveNoteIntoQueryFn,

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

        const childNotes = selectNotesByParentId(
          state,
          note.workspaceId,
          args.destinationNoteId,
        );

        const undoPatch: Partial<NoteDTO> = {
          parentId: note.parentId,
          orderHint: note.orderHint,
        };

        const newOrderHint = calculateOptimisticRankInLayer(
          childNotes,
          args.placement,
          (id: string) => selectNoteById(state, id),
        );

        dispatch(
          updateNote({
            id: args.sourceNoteId,
            changes: {
              parentId: args.destinationNoteId,
              orderHint: newOrderHint,
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
  }),
  overrideExisting: false,
});

export const { useMoveIntoMutation } = moveNoteApi;

/**
 * This export is for unit tests only. Do NOT use this in components.
 */
export const __moveNoteQueryMethods = {
  _moveNoteIntoQueryFn,
};
