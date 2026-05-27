import { DEFAULT_THEMES } from "@darkwrite/common";
import { create } from "zustand";
import App from "@/App";
import { DarkwriteAPIClient } from "@/api/api-client";
import {
  correctWorkspaceState,
  InitialUserSettings,
  initializeUserPrefs,
} from "@/init";
import { applyTheme } from "@/lib/theme-util";
import { ReactRootContainer } from "@/react-root-helper";
import store from "@/store";
import OnboardingFinish from "./finish";
import LanguageSelection from "./language-selection";
import ThemeSelection from "./theme-selection";
import WorkspaceNameStep from "./workspace-name";

export type OnboardingPage = "language" | "workspace-name" | "theme" | "finish";

export interface IOnboardingState {
  currentPage: OnboardingPage;
  previousPage: OnboardingPage | null;
  goToPage: (page: OnboardingPage) => void;
  navStack: OnboardingPage[];
  goBack: () => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  theme: string;
  enableUpdateCheck: boolean;
}

export function getOnboardingPage(key: OnboardingPage) {
  switch (key) {
    case "language":
      return <LanguageSelection />;

    case "workspace-name":
      return <WorkspaceNameStep />;

    case "theme":
      return <ThemeSelection />;

    case "finish":
      return <OnboardingFinish />;
  }
}

export const pageProgress: Record<OnboardingPage, number> = {
  language: 0,
  "workspace-name": 0.33,
  theme: 0.66,
  finish: 1,
};

export const useOnboardingState = create<IOnboardingState>()((set, get) => ({
  currentPage: "language",
  previousPage: null,
  navStack: [],
  goToPage: (page: OnboardingPage) => {
    const newStack = [...get().navStack];
    newStack.push(get().currentPage);
    set({
      currentPage: page,
      previousPage: get().currentPage,
      navStack: newStack,
    });
  },
  enableUpdateCheck: true,
  theme: "darkwrite-default",
  goBack: () => {
    const newStack = [...get().navStack];
    const previousPage = newStack.pop() || null;
    if (previousPage) {
      set({
        currentPage: previousPage,
        previousPage:
          newStack.length > 0 ? newStack[newStack.length - 1] : null,
        navStack: newStack,
      });
    }
  },
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
    .andThen(() => initializeUserPrefs(store))
    .andThen(correctWorkspaceState)
    .map(() => {
      ReactRootContainer.root.render(<App store={store} />);
    });
}
