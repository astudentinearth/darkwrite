import { embedProtocolHandler } from "@/embed/embed-protocol-handler";
import { DarkwriteIPCBridge, DarkwriteUserSettings } from "@darkwrite/common";
import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, dialog, protocol, shell } from "electron";
import log from "electron-log/main.js";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { initDevtools } from "./debug/server";
import { setupAPI } from "./ipc/api";
import {
  CURRENT_VERSION,
  isNewUser,
  markVersionMigrated,
} from "./lib/onboarding-state";
import { Paths } from "./lib/paths";
import { initAppMenu } from "./menu";
import { webcontentsUrl } from "./metadata.json";
import {
  constructWindow,
  setupWindowEvents as setupBrowserWindowEvents,
} from "./window";
import { WorkspaceService } from "./workspace/workspace.service";

import { BackupApiBridge } from "./api/backup.electron";
import { setupCsp } from "./csp";
import { db, migrateDatabaseWithBackup, MigrationError } from "./db";
import { EmbedService } from "./embed/embed.service";
import { SettingsAPI } from "./ipc/settings.handler";
import { EmbedFileStore } from "./lib/blob-store";
import { DesktopApiBridge } from "./lib/desktop-integration";
import { DocumentFileStore } from "./lib/document-store";
import { FileLinkAPI } from "./link/file-link.handler";
import { FileLinkService } from "./link/file-link.service";
import { DocumentService } from "./service/document.service";
import { SettingsService } from "./service/settings.service";
import { ThemeAPI } from "./theme/theme.handler";
import { ThemeService } from "./theme/theme.service";
import { HandlerImplements } from "./types";
import { EmbedAPI } from "./embed/embed.handler";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_SERVER_URL =
  process.env["ELECTRON_RENDERER_URL"] ?? "http://localhost:5173";

let win: BrowserWindow | null;

async function showMainWindow(
  settings: DarkwriteUserSettings,
  background: string,
) {
  win = new BrowserWindow(constructWindow(settings, background));

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

  app.on("second-instance", () => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

export async function init() {
  await Paths.initialize();
  try {
    await migrateDatabaseWithBackup(db);
    await markVersionMigrated(CURRENT_VERSION);
  } catch (error) {
    if (error instanceof MigrationError) {
      log.error("Migration failed with error:", error.error);
      log.error(`Migration log can be found at ${error.logFilePath}`);
      dialog.showErrorBox(
        "Database Migration Failed",
        `An error occurred while migrating the database. A backup of your data was created at ${error.snapshotPath}. Please check the migration log at ${error.logFilePath} for details. Create an issue at https://github.com/astudentinearth/darkwrite to help us resolve this issue.`,
      );
    }
    app.quit();
    return;
  }

  const documentStore = DocumentFileStore(Paths.NOTE_CONTENTS_DIR);
  const documentService = DocumentService(documentStore);
  const blobStore = EmbedFileStore();
  const embedService = EmbedService(db, blobStore);
  const workspaceService = WorkspaceService(db, documentService);
  const themeStore = DocumentFileStore(Paths.THEME_DIR);
  const settingsService = SettingsService(Paths.SETTINGS_PATH);
  const themeService = ThemeService(themeStore, settingsService.getSettings);
  const fileLinkService = FileLinkService(db);

  const apiBridge: HandlerImplements<DarkwriteIPCBridge> = {
    theme: ThemeAPI(themeService),
    desktop: DesktopApiBridge,
    fileLink: FileLinkAPI(fileLinkService),
    backup: BackupApiBridge,
    settings: SettingsAPI(settingsService),
    embed: EmbedAPI(embedService),
  };

  setupAPI(apiBridge);

  const workspaceResult = await workspaceService.initializeDefaultWorkspace();

  if (workspaceResult.isErr()) {
    app.quit();
    return;
  }

  // if loading fails then we are stuck with defaults
  if (!(await isNewUser())) await settingsService.loadFromFile();

  log.initialize();
  log.transports.file.level = is.dev ? "debug" : "info";
  // We change the session data directory to avoid polluting user data any further
  app.setPath("sessionData", Paths.SESSION_DATA_DIR);
  setupWindowEvents();
  protocol.handle("embed", embedProtocolHandler(embedService));

  showMainWindow(
    settingsService.getSettings(),
    themeService.getDefaultWindowBackground(),
  );
  if (is.dev) initDevtools(1200);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0)
      showMainWindow(
        settingsService.getSettings(),
        themeService.getDefaultWindowBackground(),
      );
  });
}
