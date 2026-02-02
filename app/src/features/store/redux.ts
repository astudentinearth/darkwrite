import { configureStore } from "@reduxjs/toolkit";
import { appSessionSlice } from "../session/session-slice";
import { sessionListenerMiddleware } from "../session/session-listener";
import { loadSessionState } from "../session/session-persistence";
import { notesSlice } from "../note/store/note-slice";
import { notesApi } from "../note/store/notes-api";
import { settingsSlice } from "../settings/store/settings-slice";

export const store = configureStore({
  reducer: {
    [appSessionSlice.name]: appSessionSlice.reducer,
    [notesSlice.name]: notesSlice.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(sessionListenerMiddleware.middleware)
      .concat(notesApi.middleware),
  preloadedState: {
    [appSessionSlice.name]: loadSessionState() || { workspaceId: null },
  },
});
