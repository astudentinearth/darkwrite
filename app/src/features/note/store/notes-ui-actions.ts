import { notesUiSlice } from "./notes-ui-slice";
import { AppDispatch } from "@/features/store/types";

export function MoveNoteDialogPortal(dispatch: AppDispatch) {
  function showMoveNoteDialog(noteId: string) {
    dispatch(
      notesUiSlice.actions.showMoveNoteDialog({
        noteId,
      }),
    );
  }

  function hideMoveNoteDialog() {
    dispatch(notesUiSlice.actions.closeMoveNoteDialog());
  }

  return { showMoveNoteDialog, hideMoveNoteDialog };
}
