import type { DarkwriteUserSettings } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";
import { DarkwriteAPIClient } from "./api/api-client";
import { setupAppMenuEvents } from "./features/app-menu/app-menu-bus";
import { setupContextMenuEvents } from "./features/context-menu/menu-event-bus";
import { setupLayoutEvents } from "./features/layout/layout-store";
import { appSessionSlice } from "./features/session/session-slice";
import { settingsSlice } from "./features/settings/store/settings-slice";
import type { AppStore } from "./features/store/redux";
import { initializeFonts, initializeThemes } from "./features/themes/init";
import { getWorkspaceActions } from "./features/workspaces/store/workspace-actions";
import i18n from "./i18n";

// biome-ignore lint/complexity/noStaticOnlyClass: will remove //FIXME
export class InitialUserSettings {
  static settings: DarkwriteUserSettings;
}

async function _correctWorkspaceState(store: AppStore) {
  const state = store.getState().session;
  const { fetchWorkspaces } = getWorkspaceActions(store);
  const workspaces = await fetchWorkspaces();

  if (
    !state.workspaceId ||
    workspaces.findIndex((w) => w.id === state.workspaceId) === -1
  ) {
    if (workspaces.length > 0)
      store.dispatch(appSessionSlice.actions.switchWorkspace(workspaces[0].id));
  }
}

export const correctWorkspaceState = (store: AppStore) =>
  ResultAsync.fromSafePromise(_correctWorkspaceState(store));

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
    })
    .map(() => store);
}
