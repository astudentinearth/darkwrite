import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import App from "./App";
import { DarkwriteAPIClient } from "./api/api-client";
import Onboarding from "./features/onboarding/onboarding";
import "./globals.css";
import "./i18n";
import { flushPendingEditorSaves } from "./features/editor/store/editor-middleware";
import {
  checkForUpdatesOnStartup,
  correctWorkspaceState,
  initializeUserPrefs,
  loadInitialClientInfo,
  loadInitialFileLinks,
  loadInitialNotes,
} from "./init";
import { initalizePlatform } from "./lib/platform";
import { ReactRootContainer } from "./react-root-helper";
import store from "./store";

const renderApp = () => {
  correctWorkspaceState(store)
    .andTee(() => ReactRootContainer.root.render(<App store={store} />))
    .andThen(loadInitialFileLinks)
    .andThen(loadInitialNotes)
    .andThen(loadInitialClientInfo)
    .andThen(checkForUpdatesOnStartup);
};

const renderOnboarding = () => {
  ReactRootContainer.root.render(<Onboarding />);
};

const initialize = async () => {
  if (window.isElectron) {
    await window.initPreload();
  }
  DarkwriteAPIClient.initialize();
  window.addEventListener("beforeunload", flushPendingEditorSaves);
  init({ data });
  initializeUserPrefs(store)
    .andThen(initalizePlatform)
    .andThen(DarkwriteAPIClient.onboarding.isNewUser)
    .map((isNew) => {
      if (isNew) renderOnboarding();
      else renderApp();
    });
};

initialize();
