import { createListenerMiddleware } from "@reduxjs/toolkit";
import { appSessionSlice } from "./session-slice";
import { saveSessionState } from "./session-persistence";

export const sessionListenerMiddleware = createListenerMiddleware();

sessionListenerMiddleware.startListening({
  actionCreator: appSessionSlice.actions.switchWorkspace,
  effect: async (_action, listenerApi) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = listenerApi.getState() as any;
    const sessionState = state[appSessionSlice.name];

    saveSessionState(sessionState);
  },
});
