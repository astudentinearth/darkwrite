import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, shell } from "electron";
import log from "electron-log/main.js";
import path, { join } from "node:path";
import "reflect-metadata";
import { initAppMenu } from "./menu";
import { SettingsModel } from "@/lib/settings";
import { fileURLToPath } from "node:url";
import { Paths } from "./lib/paths";
import { constructWindow } from "./window";
import { InitializeElectronAPI } from "./ipc/api";

log.initialize();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We change the session data directory to avoid polluting user data any further
app.setPath("sessionData", Paths.SESSION_DATA_DIR);

console.log("Start electron app");

let win: BrowserWindow | null;

const DEV_SERVER_URL =
  process.env["ELECTRON_RENDERER_URL"] ?? "http://localhost:5173";

async function createWindow() {
  InitializeElectronAPI();
  console.log("Creating main window");
  win = new BrowserWindow(constructWindow(SettingsModel.getDefaults()));
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (is.dev && DEV_SERVER_URL) {
    win.loadURL(DEV_SERVER_URL);
  } else {
    win.loadFile(join(__dirname, "../dist/index.html"));
  }
  initAppMenu();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
  createWindow();
  //AppDataSource.initialize().then(createWindow);
});
