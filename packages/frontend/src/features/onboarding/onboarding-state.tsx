import { DEFAULT_THEMES } from "@darkwrite/common";
import { create } from "zustand";
import { DarkwriteAPIClient } from "@/api/api-client";
import { InitialUserSettings } from "@/init";
import { applyTheme } from "@/lib/theme-util";

export interface IOnboardingState {
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  theme: string;
  enableUpdateCheck: boolean;
}

export const useOnboardingState = create<IOnboardingState>()((set, _get) => ({
  enableUpdateCheck: true,
  theme: "darkwrite-default",
  workspaceName: "",
  setWorkspaceName: (name: string) =>
    set({
      workspaceName: name,
    }),
}));

export function setOnboardingTheme(theme: string) {
  useOnboardingState.setState({ theme });
  const _theme = DEFAULT_THEMES[theme];
  applyTheme(_theme);
}

export function finishOnboarding() {
  const state = useOnboardingState.getState();
  return DarkwriteAPIClient.settings
    .getUserSettings()
    .map((prefs) => {
      prefs.appearance.darkColorScheme = state.theme;
      prefs.client.autoUpdateCheck = state.enableUpdateCheck;
      InitialUserSettings.settings = prefs;
      return prefs;
    })
    .andThen((prefs) =>
      DarkwriteAPIClient.settings.saveUserSettings(prefs).map(() => prefs),
    )
    .andThen(() => DarkwriteAPIClient.workspace.getAll())
    .map((w) => w.workspaces[0])
    .andThen((workspace) =>
      DarkwriteAPIClient.workspace.update(workspace.id, {
        name: state.workspaceName,
      }),
    )
    .andThen(DarkwriteAPIClient.onboarding.markFinished)
    .map(() => window.location.reload());
}
