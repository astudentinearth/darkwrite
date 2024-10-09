import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./globals.css";
import "./prose.css";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";

init({ data });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
