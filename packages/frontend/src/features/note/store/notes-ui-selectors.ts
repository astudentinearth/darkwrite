import { RootState } from "@/features/store/types";

export const selectMoveNoteDialogState = (state: RootState) =>
  state.noteUi.moveNoteDialog;
