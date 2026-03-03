import { store } from "@/features/store/redux";
import { notesUiSlice } from "./notes-ui-slice";

export function showMoveNoteDialog(noteId: string) {
  store.dispatch(
    notesUiSlice.actions.showMoveNoteDialog({
      noteId,
    }),
  );
}

export function hideMoveNoteDialog() {
  store.dispatch(notesUiSlice.actions.closeMoveNoteDialog());
}
