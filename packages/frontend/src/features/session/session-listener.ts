import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { appSessionSlice } from "./session-slice";
import { saveSessionState } from "./session-persistence";
import type { RootState } from "../store/types";

export const sessionListenerMiddleware = createListenerMiddleware();

sessionListenerMiddleware.startListening.withTypes<RootState>()({
  matcher: isAnyOf(
    appSessionSlice.actions.setFavoritesViewOpen,
    appSessionSlice.actions.setAllNotesViewOpen,
    appSessionSlice.actions.switchWorkspace,
  ),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const sessionState = state[appSessionSlice.name];

    saveSessionState(sessionState);
  },
});
