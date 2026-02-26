import { DarkwriteAPIClient } from "./api/api-client";
import { DarkwriteUserSettings } from "./common/settings";
import { useLocalStore } from "./context/local-state";
import { settingsSlice } from "./features/settings/store/settings-slice";
import { store } from "./features/store/redux";
import { initializeFonts, initializeThemes } from "./features/themes/init";

export class InitialUserSettings {
  static settings: DarkwriteUserSettings;
}

export async function correctWorkspaceState() {
  const state = store.getState().session;
  const { workspaces } = await DarkwriteAPIClient.workspace.getAll();

  if (
    !state.workspaceId ||
    workspaces.findIndex((w) => w.id === state.workspaceId) === -1
  ) {
    useLocalStore.setState(() => ({ workspaceId: workspaces.at(0)?.id }));
  }
}

export async function initializeUserPrefs() {
  const settings = await DarkwriteAPIClient.settings.getUserSettings();
  InitialUserSettings.settings = settings;
  store.dispatch(settingsSlice.actions.initialize(settings));
  await Promise.all([initializeThemes(), initializeFonts()]);
}
