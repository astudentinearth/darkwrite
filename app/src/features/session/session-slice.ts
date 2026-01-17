import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadSessionState, SessionState } from "./session-persistence";

const SESSION_SLICE_NAME = "session-slice";

const initialState: SessionState = loadSessionState() || {
  workspaceId: null,
};

export const appSessionSlice = createSlice({
  initialState,
  reducers: {
    switchWorkspace(state, action: PayloadAction<string>) {
      state.workspaceId = action.payload;
    },
  },
  name: SESSION_SLICE_NAME,
});
