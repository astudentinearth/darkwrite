import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import ReactDOM from "react-dom/client";
import { APIClientMode, DarkwriteAPIClient } from "./api/api-client";
import App from "./App";
import "./globals.css";
import "./i18n";
import { correctWorkspaceState } from "./init";
import Onboarding from "./features/onboarding/onboarding";

const reactRoot = ReactDOM.createRoot(document.getElementById("root")!);

const renderApp = () => {
  reactRoot.render(<App />);
};

const renderOnboarding = () => {
  reactRoot.render(<Onboarding />);
};

const initialize = async () => {
  if (window.isElectron) {
    await window.initPreload();
  }
  DarkwriteAPIClient.initialize(APIClientMode.LOCAL);
  await correctWorkspaceState();
  init({ data });

  if ((await DarkwriteAPIClient.onboarding.isCompleted()) === false) {
    renderOnboarding();
    return;
  }

  renderApp();
};

initialize();
