import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const NOTE_UI_SLICE_NAME = "noteUi";

export type MoveNoteDialogState = {
  open: boolean;
  noteId: string | null;
};

export type NotesUiState = {
  moveNoteDialog: MoveNoteDialogState;
};

export const initialNotesUiState: NotesUiState = {
  moveNoteDialog: {
    open: false,
    noteId: null,
  },
};

export const notesUiSlice = createSlice({
  name: NOTE_UI_SLICE_NAME,
  initialState: initialNotesUiState,
  reducers: {
    showMoveNoteDialog(state, action: PayloadAction<{ noteId: string }>) {
      state.moveNoteDialog.open = true;
      state.moveNoteDialog.noteId = action.payload.noteId;
    },
    closeMoveNoteDialog(state) {
      state.moveNoteDialog.open = false;
      state.moveNoteDialog.noteId = null;
    },
  },
});
