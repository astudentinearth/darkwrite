import { configureStore } from "@reduxjs/toolkit";
import { appSessionSlice } from "../session/session-slice";
import { sessionListenerMiddleware } from "../session/session-listener";
import { loadSessionState } from "../session/session-persistence";

export const store = configureStore({
  reducer: {
    [appSessionSlice.name]: appSessionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(sessionListenerMiddleware.middleware),
  preloadedState: {
    [appSessionSlice.name]: loadSessionState() || { workspaceId: null },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
