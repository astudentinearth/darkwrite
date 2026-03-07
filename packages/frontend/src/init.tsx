import { DarkwriteAPIClient } from "./api/api-client";
import { DarkwriteUserSettings } from "./common/settings";
import { appSessionSlice } from "./features/session/session-slice";
import { settingsSlice } from "./features/settings/store/settings-slice";
import { AppStore } from "./features/store/redux";
import { initializeFonts, initializeThemes } from "./features/themes/init";
import { getWorkspaceActions } from "./features/workspaces/store/workspace-actions";

export class InitialUserSettings {
  static settings: DarkwriteUserSettings;
}

export async function correctWorkspaceState(store: AppStore) {
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

export async function initializeUserPrefs(store: AppStore) {
  const settings = await DarkwriteAPIClient.settings.getUserSettings();
  InitialUserSettings.settings = settings;
  store.dispatch(settingsSlice.actions.initialize(settings));
  await Promise.all([initializeThemes(store), initializeFonts(store)]);
}
