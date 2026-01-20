import { DarkwriteAPIClient } from "@/api/api-client";
import { NoteDTO, NotesResponseDTO } from "@/common/dto";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertNotes } from "./note-slice";
import { appSessionSlice } from "@/features/session/session-slice";
import { ParentId } from "@/common/note";
import { notesAdapter } from "./notes-adapter";
import { Rank } from "@/common/rank";
import { selectNoteById, selectNotesByParentId } from "./note-selectors";
import { RootState } from "@/features/store/redux";

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

    // needed endpoints
    // move to top (by parentid)
    // move below (by parentid)

    /**
     * Moves the note directly below another note, within the same tree level.
     * If the source note and the anchor note have different parents,
     * the parent of the source will be set to the anchor's parent.
     */
    moveInto: builder.mutation<NoteDTO, MoveNoteIntoArgs>({
      async queryFn(
        { destinationNoteId, placement, sourceNoteId },
        { getState },
      ) {
        const state = getState() as RootState;
        const sourceNote: NoteDTO | undefined = selectNoteById(
          state,
          sourceNoteId,
        );

        if (!sourceNote) {
          throw new Error("Source note not found");
        }

        const workspaceId = sourceNote.workspaceId;

        const siblings = selectNotesByParentId(
          state,
          workspaceId,
          destinationNoteId,
        );
      },
    }),
  }),
});

export const { useGetNotesByParentIdQuery } = notesApi;
