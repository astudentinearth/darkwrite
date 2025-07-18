import log from "electron-log/main.js";
import { Paths } from "./lib/paths";
import { app, BrowserWindow, shell } from "electron";
import { ElectronPrefsModel } from "./prefs";
import { InitializeElectronAPI } from "./ipc/api";
import { constructWindow } from "./window";
import path, { join } from "path";
import { is } from "@electron-toolkit/utils";
import { webcontentsUrl } from "./metadata.json";
import { initAppMenu } from "./menu";
import { AppDataSource } from "./db";
import { fileURLToPath } from "url";
import { WorkspaceService } from "./service/workspace.service";
import { initDevtools } from "./debug/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_SERVER_URL =
  process.env["ELECTRON_RENDERER_URL"] ?? "http://localhost:5173";

let win: BrowserWindow | null;

async function createWindow() {
  InitializeElectronAPI();
  win = new BrowserWindow(constructWindow(ElectronPrefsModel.get()));

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (is.dev && DEV_SERVER_URL) {
    await win.loadURL(DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(__dirname, webcontentsUrl));
  }
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
}

export async function init() {
  const prefs = await ElectronPrefsModel.initialize();
  await Paths.initialize();
  log.initialize();
  // We change the session data directory to avoid polluting user data any further
  app.setPath("sessionData", Paths.SESSION_DATA_DIR);
  setupWindowEvents();
  await AppDataSource.initialize();
  await new WorkspaceService().initializeDefaultWorkspace();
  createWindow();
  if(is.dev) initDevtools(1200);
}