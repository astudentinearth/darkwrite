import { notesUiSlice } from "./notes-ui-slice";
import type { AppDispatch } from "@/features/store/types";

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

export function ClearTrashDialogPortal(dispatch: AppDispatch) {
  function showClearTrashDialog() {
    dispatch(notesUiSlice.actions.showClearTrashDialog());
  }

  function hideClearTrashDialog() {
    dispatch(notesUiSlice.actions.closeClearTrashDialog());
  }

  return { showClearTrashDialog, hideClearTrashDialog };
}
