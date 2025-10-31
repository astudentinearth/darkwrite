import { create } from "zustand";
import LanguageSelection from "./language-selection";
import WorkspaceNameStep from "./workspace-name";

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
}

export function getOnboardingPage(key: OnboardingPage) {
  switch (key) {
    case "language":
      return <LanguageSelection />;

    case "workspace-name":
      return <WorkspaceNameStep />;

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
