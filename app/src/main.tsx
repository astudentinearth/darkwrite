import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import "./globals.css";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { APIClientMode, DarkwriteAPIClient } from "./api/api-client";
import { useLocalStore } from "./context/local-state";

const renderApp = () => {
  init({ data });
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <App />
  );
};

const initialize = async () => {
  if (window.isElectron) {
    await window.initPreload();
  }
  DarkwriteAPIClient.initialize(APIClientMode.LOCAL);
  const state = useLocalStore.getState();
  const { workspaces } = await DarkwriteAPIClient.workspace.getAll();
  if (!state.workspaceId || workspaces.findIndex(w => w.id === state.workspaceId) === -1) {
    useLocalStore.setState(() => ({ workspaceId: workspaces.at(0)?.id }));
  }
  renderApp();
};

initialize();
