import path, { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type DarkwriteIPCBridge,
  type DarkwriteUserSettings,
  type DwError,
  panic,
} from "@darkwrite/common";
import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, dialog, protocol, shell } from "electron";
import log from "electron-log/main.js";
import { okAsync } from "neverthrow";
import { embedProtocolHandler } from "@/embed/embed-protocol-handler";
import { BackupApiBridge } from "./api/backup.electron";
import { setupCsp } from "./csp";
import { db, initDatabase, migrateDatabaseOrExit } from "./db";
import { initDevtools } from "./debug/server";
import { EmbedAPI } from "./embed/embed.handler";
import { EmbedService } from "./embed/embed.service";
import { setupAPI } from "./ipc/api";
import { SettingsAPI } from "./ipc/settings.handler";
import { EmbedFileStore } from "./lib/blob-store";
import { DesktopApiBridge } from "./lib/desktop-integration";
import { DocumentFileStore } from "./lib/document-store";
import { CURRENT_VERSION, OnboardingService } from "./lib/onboarding-state";
import { Paths } from "./lib/paths";
import { updateCheckHandler } from "./lib/update";
import { FileLinkAPI } from "./link/file-link.handler";
import { FileLinkService } from "./link/file-link.service";
import { initAppMenu, showAppMenu } from "./menu";
import { webcontentsUrl } from "./metadata.json";
import { DatabaseAPI } from "./note/database.handler";
import { NoteAPI } from "./note/note.handler";
import { NoteService } from "./note/note.service";
import { NoteQueryService } from "./note/note-query.service";
import { DocumentService } from "./service/document.service";
import { SettingsService } from "./service/settings.service";
import { ThemeAPI } from "./theme/theme.handler";
import { ThemeService } from "./theme/theme.service";
import { type HandlerImplements, handler } from "./types";
import {
  constructWindow,
  setupWindowEvents as setupBrowserWindowEvents,
} from "./window";
import { WorkspaceAPI } from "./workspace/workspace.handler";
import { WorkspaceService } from "./workspace/workspace.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_SERVER_URL =
  process.env.ELECTRON_RENDERER_URL ?? "http://localhost:5173";

let win: BrowserWindow | null;

const bail = (msg: string | DwError): never => {
  log.error("== INITIALIZATION FAILURE ==");
  dialog.showErrorBox(
    "Darkwrite failed to start",
    typeof msg === "string" ? msg : `${msg.message} cause:${String(msg.cause)}`,
  );
  app.quit();
  panic(typeof msg === "string" ? msg : `${msg.message} cause:${msg.cause}`);
};

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
  log.initialize();
  log.transports.file.level = is.dev ? "debug" : "info";

  const onboardingService = OnboardingService(
    Paths.ONBOARD_FLAG_PATH,
    Paths.VERSION_FLAG_PATH,
  );

  const initializationResult = await Paths.initialize()
    .orElse((err) => bail(err))
    .map(initDatabase)
    .andThen(migrateDatabaseOrExit) // this intentionally shows an error box, quits, then throws if anything goes wrong.
    .orElse(() => panic("Database failed to migrate!"))
    .andThen(() => onboardingService.markVersionMigrated(CURRENT_VERSION));

  if (initializationResult.isErr()) {
    bail(initializationResult.error);
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
  const noteQueryService = NoteQueryService(db);
  const noteService = NoteService(db, documentService);

  const apiBridge: HandlerImplements<DarkwriteIPCBridge> = {
    theme: ThemeAPI(themeService),
    desktop: DesktopApiBridge,
    fileLink: FileLinkAPI(fileLinkService),
    backup: BackupApiBridge,
    settings: SettingsAPI(settingsService),
    embed: EmbedAPI(embedService),
    workspace: WorkspaceAPI(workspaceService),
    note: NoteAPI(noteService, noteQueryService, documentService),
    database: DatabaseAPI({ noteService, noteQueryService }),
    checkUpdate: updateCheckHandler,
    showAppMenu: handler(() => {
      showAppMenu();
      return okAsync();
    }),
    onboarding: onboardingService.ipcHandlers,
  };

  log.debug("Settings up API bridge...");
  setupAPI(apiBridge);

  await workspaceService
    .initializeDefaultWorkspace()
    .orElse(bail)
    .andThen(settingsService.loadFromFile);

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
