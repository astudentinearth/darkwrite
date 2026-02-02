import { createListenerMiddleware } from "@reduxjs/toolkit";
import { appSessionSlice } from "./session-slice";
import { saveSessionState } from "./session-persistence";
import { RootState } from "../store/types";

export const sessionListenerMiddleware = createListenerMiddleware();

sessionListenerMiddleware.startListening({
  actionCreator: appSessionSlice.actions.switchWorkspace,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const sessionState = state[appSessionSlice.name];

    saveSessionState(sessionState);
  },
});
