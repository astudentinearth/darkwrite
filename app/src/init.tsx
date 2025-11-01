import { DarkwriteAPIClient } from "./api/api-client";
import { DarkwriteUserSettings } from "./common/settings";
import { useLocalStore } from "./context/local-state";

export class InitialUserSettings {
  static settings: DarkwriteUserSettings;
}

export async function correctWorkspaceState() {
  const state = useLocalStore.getState();
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
}
