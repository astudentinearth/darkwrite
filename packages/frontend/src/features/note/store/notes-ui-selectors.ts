import type { RootState } from "@/features/store/types";

export const selectMoveNoteDialogState = (state: RootState) =>
  state.noteUi.moveNoteDialog;

export const selectClearTrashDialogState = (state: RootState) =>
  state.noteUi.trashDialog;
