import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const NOTE_UI_SLICE_NAME = "noteUi";

export type MoveNoteDialogState = {
  open: boolean;
  noteId: string | null;
};

export type ClearTrashDialogState = {
  open: boolean;
};
export type SidebarUiState = {
  expandedFavorites: string[];
  expandedNotes: string[];
};

export type NotesUiState = {
  moveNoteDialog: MoveNoteDialogState;
  trashDialog: ClearTrashDialogState;
  sidebar: SidebarUiState;
};

export const initialNotesUiState: NotesUiState = {
  moveNoteDialog: {
    open: false,
    noteId: null,
  },
  trashDialog: {
    open: false,
  },
  sidebar: {
    expandedFavorites: [],
    expandedNotes: [],
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
      state.trashDialog.open = true;
    },
    closeClearTrashDialog(state) {
      state.trashDialog.open = false;
    },
    expandNote(state, { payload: id }: PayloadAction<string>) {
      state.sidebar.expandedNotes = Array.from(
        new Set(state.sidebar.expandedNotes).add(id),
      );
    },
    expandFavorite(state, { payload: id }: PayloadAction<string>) {
      state.sidebar.expandedFavorites = Array.from(
        new Set(state.sidebar.expandedFavorites).add(id),
      );
    },
    collapseNote(state, { payload: id }: PayloadAction<string>) {
      state.sidebar.expandedNotes = state.sidebar.expandedNotes.filter(
        (n) => n !== id,
      );
    },
    collapseFavorite(state, { payload: id }: PayloadAction<string>) {
      state.sidebar.expandedFavorites = state.sidebar.expandedFavorites.filter(
        (n) => n !== id,
      );
    },
  },
});
