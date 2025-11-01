import { create } from "zustand";
import LanguageSelection from "./language-selection";
import WorkspaceNameStep from "./workspace-name";
import { DEFAULT_THEMES } from "@/common/themes";
import { applyTheme } from "@/lib/theme-util";
import ThemeSelection from "./theme-selection";
import OnboardingFinish from "./finish";
import { DarkwriteAPIClient } from "@/api/api-client";
import { ReactRootContainer } from "@/react-root-helper";
import App from "@/App";
import { InitialUserSettings } from "@/init";

export type OnboardingPage =
  | "language"
  | "workspace-name"
  | "theme"
  | "finish"
  | "workspace-name-migrator"
  | "finish-migrator"
  | "migration-error";

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

    default:
      return <div></div>;
  }
}

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

export async function finishOnboarding() {
  const prefs = await DarkwriteAPIClient.settings.getUserSettings();
  const state = useOnboardingState.getState();
  prefs.appearance.darkColorScheme = state.theme;
  prefs.client.autoUpdateCheck = state.enableUpdateCheck;

  await DarkwriteAPIClient.settings.saveUserSettings(prefs);

  const { workspaces } = await DarkwriteAPIClient.workspace.getAll();
  const defaultWorkspace = workspaces[0];

  await DarkwriteAPIClient.workspace.update(defaultWorkspace.id, {
    name: state.workspaceName,
  });

  await DarkwriteAPIClient.onboarding.markFinished();
  InitialUserSettings.settings = prefs;

  ReactRootContainer.root.render(<App />);
}
