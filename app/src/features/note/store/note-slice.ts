import { createSlice } from "@reduxjs/toolkit";
import { notesAdapter } from "./notes-adapter";

export const NOTES_SLICE_NAME = "notes-slice";

export const notesSlice = createSlice({
  initialState: notesAdapter.getInitialState(),
  reducers: {
    upsertNotes: notesAdapter.upsertMany,
    removeNote: notesAdapter.removeOne,
    setAllNotes: notesAdapter.setAll,
    updateNote: notesAdapter.updateOne,
    updateMany: notesAdapter.updateMany,
  },
  name: NOTES_SLICE_NAME,
});

export const { removeNote, setAllNotes, updateMany, updateNote, upsertNotes } =
  notesSlice.actions;
