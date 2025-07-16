import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import "./globals.css";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";

const renderApp = () => {
  init({ data });
  ReactDOM.createRoot(document.getElementById("root")!).render(
      <App />
  );
};

const waitAPI = async () => {
  if(window.isElectron){
    await window.initPreload();
  }
  renderApp();
};

waitAPI();
