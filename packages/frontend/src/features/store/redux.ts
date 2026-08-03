import { configureStore } from "@reduxjs/toolkit";
import { clientSlice } from "../client/store/client-slice";
import editorMiddleware from "../editor/store/editor-middleware";
import { editorSlice } from "../editor/store/editor-slice";
import { fileLinkSlice } from "../link/store/file-link.slice";
import { notesSlice } from "../note/store/note-slice";
import { notesUiSlice } from "../note/store/notes-ui-slice";
import { sessionListenerMiddleware } from "../session/session-listener";
import {
  DEFAULT_SESSION_STATE,
  loadSessionState,
} from "../session/session-persistence";
import { appSessionSlice } from "../session/session-slice";
import { settingsPersistenceMiddleware } from "../settings/store/settings-persistence";
import { settingsSlice } from "../settings/store/settings-slice";
import { themeSlice } from "../themes/store/theme-slice";
import { workspaceSlice } from "../workspaces/store/workspace-slice";

export function createAppStore() {
  return configureStore({
    reducer: {
      [appSessionSlice.name]: appSessionSlice.reducer,
      [notesSlice.name]: notesSlice.reducer,
      [settingsSlice.name]: settingsSlice.reducer,
      [editorSlice.name]: editorSlice.reducer,
      [themeSlice.name]: themeSlice.reducer,
      [workspaceSlice.name]: workspaceSlice.reducer,
      [clientSlice.name]: clientSlice.reducer,
      [notesUiSlice.name]: notesUiSlice.reducer,
      [fileLinkSlice.name]: fileLinkSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(sessionListenerMiddleware.middleware)
        .prepend(settingsPersistenceMiddleware.middleware)
        .prepend(editorMiddleware.middleware),
    preloadedState: {
      [appSessionSlice.name]: loadSessionState() || DEFAULT_SESSION_STATE,
    },
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
