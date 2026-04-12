import { SettingsModel } from "@darkwrite/common";
import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, protocol, shell } from "electron";
import log from "electron-log/main.js";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { initDevtools } from "./debug/server";
import { InitializeElectronAPI } from "./ipc/api";
import { embedProtocolHandler } from "./ipc/embed-protocol-handler";
import { isNewUser } from "./lib/onboarding-state";
import { Paths } from "./lib/paths";
import { initAppMenu } from "./menu";
import { webcontentsUrl } from "./metadata.json";
import { ElectronPrefsModel } from "./prefs";
import { HealthService } from "./service/health.service";
import { WorkspaceService } from "./workspace/workspace.service";
import {
  constructWindow,
  setupWindowEvents as setupBrowserWindowEvents,
} from "./window";

import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import { setupCsp } from "./csp";
import { db, migrateDatabase } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_SERVER_URL =
  process.env["ELECTRON_RENDERER_URL"] ?? "http://localhost:5173";

let win: BrowserWindow | null;

async function createWindow() {
  InitializeElectronAPI();
  win = new BrowserWindow(
    constructWindow(
      ElectronPrefsModel.get(),
      ElectronPrefsModel.getDefaultWindowBackground(),
    ),
  );

  setupBrowserWindowEvents(win);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  setupCsp();
  if (is.dev && DEV_SERVER_URL) {
    await win.loadURL(DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(__dirname, webcontentsUrl));
  }
  //  win.webContents.setZoomFactor(1.0);
  initAppMenu();
}

function setupWindowEvents() {
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
      win = null;
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("second-instance", () => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

export async function init() {
  if (is.dev) {
    await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
    await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
  }
  await Paths.initialize();
  await migrateDatabase(db);
  if (await isNewUser()) {
    // settings will be persisted after the onboarding
    ElectronPrefsModel.override(SettingsModel.getDefaults());
  } else {
    await ElectronPrefsModel.initialize();
    await new WorkspaceService().initializeDefaultWorkspace();
  }
  log.initialize();
  log.transports.file.level = is.dev ? "debug" : "info";
  // We change the session data directory to avoid polluting user data any further
  app.setPath("sessionData", Paths.SESSION_DATA_DIR);
  setupWindowEvents();
  protocol.handle("embed", embedProtocolHandler);

  createWindow();
  if (is.dev) initDevtools(1200);
}
