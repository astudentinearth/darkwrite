import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const NOTE_UI_SLICE_NAME = "noteUi";

export type MoveNoteDialogState = {
  open: boolean;
  noteId: string | null;
};

export type ClearTrashDialogState = {
  open: boolean;
};

export type NotesUiState = {
  moveNoteDialog: MoveNoteDialogState;
  trashDialog: ClearTrashDialogState;
};

export const initialNotesUiState: NotesUiState = {
  moveNoteDialog: {
    open: false,
    noteId: null,
  },
  trashDialog: {
    open: false,
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
    showClearTrashDialog(state) {
      console.log("showing clear trash dialog");
      state.trashDialog.open = true;
    },
    closeClearTrashDialog(state) {
      state.trashDialog.open = false;
    },
  },
});
