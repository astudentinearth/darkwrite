import { configureStore } from "@reduxjs/toolkit";
import { appSessionSlice } from "../session/session-slice";
import { sessionListenerMiddleware } from "../session/session-listener";
import { loadSessionState } from "../session/session-persistence";
import { notesSlice } from "../note/store/note-slice";
import { notesApi } from "../note/store/notes-api";
import { settingsSlice } from "../settings/store/settings-slice";
import { settingsPersistenceMiddleware } from "../settings/store/settings-persistence";
import { editorSlice } from "../editor/store/editor-slice";
import { themeSlice } from "../themes/store/theme-slice";
import { editorApi } from "../editor/store/editor-api";
import editorMiddleware from "../editor/store/editor-middleware";
import { updateApi } from "../update/store/update-api";

export const store = configureStore({
  reducer: {
    [appSessionSlice.name]: appSessionSlice.reducer,
    [notesSlice.name]: notesSlice.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [editorSlice.name]: editorSlice.reducer,
    [editorApi.reducerPath]: editorApi.reducer,
    [themeSlice.name]: themeSlice.reducer,
    [updateApi.reducerPath]: updateApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(sessionListenerMiddleware.middleware)
      .prepend(settingsPersistenceMiddleware.middleware)
      .prepend(editorMiddleware.middleware)
      .concat(notesApi.middleware, editorApi.middleware, updateApi.middleware),
  preloadedState: {
    [appSessionSlice.name]: loadSessionState() || { workspaceId: null },
  },
});
