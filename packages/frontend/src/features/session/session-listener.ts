import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { RootState } from "../store/types";
import { saveSessionState } from "./session-persistence";
import { appSessionSlice } from "./session-slice";

export const sessionListenerMiddleware = createListenerMiddleware();

sessionListenerMiddleware.startListening.withTypes<RootState>()({
  matcher: isAnyOf(...Object.values(appSessionSlice.actions)),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const sessionState = state[appSessionSlice.name];

    saveSessionState(sessionState);
  },
});
