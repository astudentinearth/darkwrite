import { RootState } from "@/features/store/redux";
import { notesAdapter } from "./notes-adapter";
import { createSelector } from "@reduxjs/toolkit";
import { Rank } from "@/common/rank";

const selectNotesState = (store: RootState) => store["notes-slice"];

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectEntities: selectAllNotesAsMap,
} = notesAdapter.getSelectors(selectNotesState);

export const selectNotesByParentId = createSelector(
  [
    selectAllNotes,
    (_state: RootState, workspaceId: string) => workspaceId,
    (_state: RootState, _workspaceId: string, parentId: string | null) =>
      parentId,
  ],
  (allNotes, workspaceId, parentId) => {
    return allNotes
      .filter(
        (note) =>
          note.workspaceId === workspaceId &&
          note.parentId === parentId &&
          !note.isTrashed,
      )
      .toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint))
      .map((n) => n.id);
  },
);
