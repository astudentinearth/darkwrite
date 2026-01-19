import { RootState } from "@/features/store/redux";
import { notesAdapter } from "./notes-adapter";
import { createSelector } from "@reduxjs/toolkit";

const selectNotesState = (store: RootState) => store["notes-slice"];

export const { selectAll: selectAllNotes, selectById: selectNoteById } =
  notesAdapter.getSelectors(selectNotesState);

export const selectNotesByParentId = createSelector(
  [
    selectAllNotes,
    (_state: RootState, workspaceId: string, _parentId: string | null) =>
      workspaceId,
    (_state: RootState, _workspaceId: string, parentId: string | null) =>
      parentId,
  ],
  (allNotes, workspaceId, parentId) => {
    return allNotes
      .filter(
        (note) =>
          note.workspaceId === workspaceId && note.parentId === parentId,
      )
      .map((n) => n.id);
  },
);
