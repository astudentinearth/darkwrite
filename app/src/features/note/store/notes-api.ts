import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NotesResponseDTO } from "@/common/dto";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateNote, upsertNotes } from "./note-slice";
import { ParentId } from "@/common/note";
import { Rank } from "@/common/rank";
import { selectNoteById, selectNotesByParentId } from "./note-selectors";
import { RootState } from "@/features/store/redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

export const NOTES_API_REDUCER_PATH = "notes-api";
export const NOTES_TAG_TYPE = "Note";

export function noteByWorkspaceIdTag(workspaceId: string) {
  return `WORKSPACE_${workspaceId}`;
}

export function noteByParentIdTag(
  workspaceId: string,
  parentId: string | null,
) {
  return `WORKSPACE_${workspaceId}_PARENT_${parentId ?? "ROOT"}`;
}

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
  placement: "start" | "end";
};

const tryFetch = async (promise: Promise<NotesResponseDTO>) => {
  try {
    const { notes } = await promise;
    return {
      data: Object.values(notes),
    };
  } catch (error) {
    return { error: error as Error };
  }
};

export const notesApi = createApi({
  reducerPath: NOTES_API_REDUCER_PATH,
  baseQuery: fakeBaseQuery(),
  tagTypes: [NOTES_TAG_TYPE],
  endpoints: (builder) => ({
    getNotesByParentId: builder.query<
      NoteDTO[],
      { parentId: string | null; workspaceId: string }
    >({
      queryFn: ({ parentId, workspaceId }) =>
        tryFetch(DarkwriteAPIClient.note.getByParentId(workspaceId, parentId)),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertNotes(data));
        } catch {
          /* empty */
        }
      },

      providesTags: (result, _error, args) =>
        result
          ? [
              {
                type: NOTES_TAG_TYPE,
                id: noteByParentIdTag(args.workspaceId, args.parentId),
              },
            ]
          : [],
    }),

    /**
     * Moves the note directly below another note, within the same tree level.
     * If the source note and the anchor note have different parents,
     * the parent of the source will be set to the anchor's parent.
     */
    moveInto: builder.mutation<NoteDTO, MoveNoteIntoArgs>({
      async queryFn({ destinationNoteId, placement, sourceNoteId }) {
        try {
          const { note } = await DarkwriteAPIClient.note.move({
            destinationId: destinationNoteId,
            placement: placement === "start" ? "inside-start" : "inside-end",
            sourceId: sourceNoteId,
          });
          if (!note) {
            throw new Error("Failed to move note");
          }
          return { data: note };
        } catch (error) {
          return { error: error as Error };
        }
      },

      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const note = selectNoteById(state, args.sourceNoteId);
        if (!note) return;

        const childNotes = selectNotesByParentId(
          state,
          note.workspaceId,
          args.destinationNoteId,
        );

        const undoPatch: Partial<NoteDTO> = {
          parentId: note.parentId,
          orderHint: note.orderHint,
        };

        if (childNotes.length === 0) {
          const newOrderHint = Rank.default().get();
          dispatch(
            updateNote({
              id: args.sourceNoteId,
              changes: {
                parentId: args.destinationNoteId,
                orderHint: newOrderHint,
              },
            }),
          );
        } else {
          let newOrderHint: string;

          if (args.placement === "start") {
            const firstChild = selectNoteById(state, childNotes[0]);
            const rank = new Rank(firstChild.orderHint).prev();
            newOrderHint = rank.get();
          } else {
            const lastChild = selectNoteById(
              state,
              childNotes[childNotes.length - 1],
            );
            const rank = new Rank(lastChild.orderHint).next();
            newOrderHint = rank.get();
          }

          dispatch(
            updateNote({
              id: args.sourceNoteId,
              changes: {
                parentId: args.destinationNoteId,
                orderHint: newOrderHint,
              },
            }),
          );
        }

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
});

export const { useGetNotesByParentIdQuery } = notesApi;
