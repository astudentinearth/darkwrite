import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DEFAULT_SESSION_STATE,
  loadSessionState,
  SessionState,
} from "./session-persistence";

const SESSION_SLICE_NAME = "session";

const initialState: SessionState = loadSessionState() || DEFAULT_SESSION_STATE;

export const appSessionSlice = createSlice({
  initialState,
  reducers: {
    switchWorkspace(state, action: PayloadAction<string>) {
      state.workspaceId = action.payload;
    },
    setAllNotesViewOpen(state, action: PayloadAction<boolean>) {
      state.allNotesViewOpen = action.payload;
    },
    setFavoritesViewOpen(state, action: PayloadAction<boolean>) {
      state.favoritesViewOpen = action.payload;
    },
  },
  name: SESSION_SLICE_NAME,
});
