import { NoteDTO } from "@/common/dto";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const NOTES_SLICE_NAME = "notes-slice";

const notesAdapter = createEntityAdapter<NoteDTO>({});

export const notesSlice = createSlice({
  initialState: notesAdapter.getInitialState(),
  reducers: {},
  name: NOTES_SLICE_NAME,
});
