import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { APIClientMode, DarkwriteAPIClient } from "./api/api-client";
import App from "./App";
import Onboarding from "./features/onboarding/onboarding";
import "./globals.css";
import "./i18n";
import { correctWorkspaceState, initializeUserPrefs } from "./init";
import { ReactRootContainer } from "./react-root-helper";

const renderApp = () => {
  ReactRootContainer.root.render(<App />);
};

const renderOnboarding = () => {
  ReactRootContainer.root.render(<Onboarding />);
};

const initialize = async () => {
  if (window.isElectron) {
    await window.initPreload();
  }
  DarkwriteAPIClient.initialize(APIClientMode.LOCAL);
  await correctWorkspaceState();
  init({ data });
  await initializeUserPrefs();
  if ((await DarkwriteAPIClient.onboarding.isCompleted()) === false) {
    renderOnboarding();
    return;
  }

  renderApp();
};

initialize();
