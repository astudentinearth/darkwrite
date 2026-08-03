import type { DarkwriteUserSettings } from "@darkwrite/common";
import { okAsync } from "neverthrow";
import { DarkwriteAPIClient } from "./api/api-client";
import { useLocalStore } from "./context/local-state";
import { setupAppMenuEvents } from "./features/app-menu/app-menu-bus";
import {
  checkForUpdate,
  loadClientInfo,
} from "./features/client/store/client-thunk";
import { setupContextMenuEvents } from "./features/context-menu/menu-event-bus";
import { setupLayoutEvents } from "./features/layout/layout-store";
import { loadFileLinks } from "./features/link/store/file-link.thunk";
import { setupFileLinkEvents } from "./features/link/store/file-link-events";
import { loadNotesInCurrentWorkspace } from "./features/note/store/note.thunk";
import { switchWorkspace } from "./features/session/session.thunk";
import { settingsSlice } from "./features/settings/store/settings-slice";
import type { AppStore } from "./features/store/redux";
import { initializeFonts, initializeThemes } from "./features/themes/init";
import { reloadWorkspaces } from "./features/workspaces/store/workspace.thunk";
import i18n from "./i18n";

const UPDATE_CHECK_THROTTLE_MS = 1000 * 60 * 60;

// biome-ignore lint/complexity/noStaticOnlyClass: will remove //FIXME
export class InitialUserSettings {
  static settings: DarkwriteUserSettings;
}

export const correctWorkspaceState = (store: AppStore) =>
  store.dispatch(reloadWorkspaces()).andThen(({ workspaces }) => {
    const state = store.getState().session;
    if (
      !state.workspaceId ||
      workspaces.findIndex((w) => w.id === state.workspaceId) === -1
    ) {
      if (workspaces.length > 0) {
        store.dispatch(switchWorkspace(workspaces[0].id));
      }
    }
    return okAsync(store);
  });

/** Mirrors the detected/selected UI language into user settings so the
 * main process can localize itself. localStorage (the language detector
 * cache) remains the renderer's source of truth. */
function setupLanguageSync(store: AppStore) {
  const syncLanguage = (lng: string) => {
    if (store.getState().settings.client.language !== lng) {
      store.dispatch(
        settingsSlice.actions.update({ client: { language: lng } }),
      );
    }
  };
  i18n.on("languageChanged", syncLanguage);
  // converge existing users whose language only lives in localStorage
  syncLanguage(i18n.resolvedLanguage ?? i18n.language);
}

export const loadInitialNotes = (store: AppStore) =>
  store.dispatch(loadNotesInCurrentWorkspace()).map(() => store);

export const loadInitialFileLinks = (store: AppStore) =>
  store.dispatch(loadFileLinks()).map(() => store);

export const loadInitialClientInfo = (store: AppStore) =>
  store.dispatch(loadClientInfo()).map(() => store);

/** Fires a single update check on startup when auto-update is enabled and the
 * last check was over an hour ago. Fire-and-forget: the thunk owns its own
 * error/toast handling, so a failure never blocks boot. */
export const checkForUpdatesOnStartup = (store: AppStore) => {
  if (store.getState().settings.client.autoUpdateCheck) {
    const { lastUpdateCheck, setLastUpdateCheckTimestamp } =
      useLocalStore.getState();
    if (
      Date.now() - new Date(lastUpdateCheck).valueOf() >=
      UPDATE_CHECK_THROTTLE_MS
    ) {
      store.dispatch(checkForUpdate({ notify: true }));
      setLastUpdateCheckTimestamp(new Date());
    }
  }
  return okAsync(store);
};

export function initializeUserPrefs(store: AppStore) {
  return DarkwriteAPIClient.settings
    .getUserSettings()
    .map((settings) => {
      InitialUserSettings.settings = settings;
      store.dispatch(settingsSlice.actions.initialize(settings));
      setupLanguageSync(store);
      return store;
    })
    .andThen(initializeThemes)
    .andThen(initializeFonts)
    .andTee(() => {
      setupContextMenuEvents();
      setupAppMenuEvents();
      setupLayoutEvents();
      setupFileLinkEvents(store);
    })
    .map(() => store);
}
