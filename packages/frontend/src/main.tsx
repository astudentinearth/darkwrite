import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import App from "./App";
import { DarkwriteAPIClient } from "./api/api-client";
import Onboarding from "./features/onboarding/onboarding";
import "./globals.css";
import "./i18n";
import { okAsync } from "neverthrow";
import { flushPendingEditorSaves } from "./features/editor/store/editor-middleware";
import {
  InitializationFailureScreen,
  RootErrorBoundary,
} from "./features/error/root-error-boundary";
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

const renderApp = () =>
  correctWorkspaceState(store)
    .andThen(loadInitialFileLinks)
    .andThen(loadInitialNotes)
    .andThen(loadInitialClientInfo)
    .andThen(checkForUpdatesOnStartup)
    .andTee(() =>
      ReactRootContainer.root.render(
        <RootErrorBoundary>
          <App store={store} />
        </RootErrorBoundary>,
      ),
    );

const renderOnboarding = () => {
  ReactRootContainer.root.render(<Onboarding />);
};

const initialize = async () => {
  await window.initPreload();
  DarkwriteAPIClient.initialize();
  window.addEventListener("beforeunload", flushPendingEditorSaves);
  init({ data });
  initializeUserPrefs(store)
    .andThen(initalizePlatform)
    .andThen(DarkwriteAPIClient.onboarding.isNewUser)
    .andThen((isNew) => {
      if (isNew) {
        renderOnboarding();
        return okAsync();
      } else return renderApp();
    })
    .orTee((err) =>
      ReactRootContainer.root.render(
        <InitializationFailureScreen error={err} />,
      ),
    );
};

initialize();
