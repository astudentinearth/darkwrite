import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { APIClientMode, DarkwriteAPIClient } from "./api/api-client";
import App from "./App";
import Onboarding from "./features/onboarding/onboarding";
import "./globals.css";
import "./i18n";
import { correctWorkspaceState, initializeUserPrefs } from "./init";
import { ReactRootContainer } from "./react-root-helper";
import { initalizePlatform } from "./lib/platform";
import store from "./store";
import { flushPendingEditorSaves } from "./features/editor/store/editor-middleware";

const renderApp = async () => {
  await correctWorkspaceState(store);
  ReactRootContainer.root.render(<App store={store} />);
};

const renderOnboarding = () => {
  ReactRootContainer.root.render(<Onboarding />);
};

const initialize = async () => {
  if (window.isElectron) {
    await window.initPreload();
  }
  DarkwriteAPIClient.initialize(APIClientMode.LOCAL);
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
