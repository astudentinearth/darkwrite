import { deepAssign, find, recursiveKeys } from "@common/object";
import { showAppMenu } from "@main/menu";
import {
  DarkwriteAPI,
  InferPreloadAPI,
  IPCHandler,
  IPCMainListenerUnion,
  IPCMainListenerWithoutEvent,
} from "@main/types";
import { ipcMain } from "electron";
import { ElectronNoteAPI } from "../note/note.handler";
import { ElectronEmbedAPI } from "./embed.handler";
import { ElectronWorkspaceAPI } from "./workspace.handler";
import { ElectronSettingsAPI } from "./settings.handler";
import { ElectronThemeAPI } from "./theme.handler";
import { DesktopIntegration } from "../lib/desktop-integration";
import {
  hasOnboarded,
  isAlphaMigrationPerformed,
  isNewUser,
  markOnboardingCompleted,
} from "../lib/onboarding-state";
import { BackupAPI, HTMLExporterAPI } from "../api/backup.electron";
import { migrateAlphaToV1 } from "../migrator/alpha-to-v1";
import { Updater } from "../lib/update";
import log from "electron-log";

export const DarkwriteElectronAPI = {
  note: {
    create: new IPCHandler(false, ElectronNoteAPI.create),
    delete: new IPCHandler(false, ElectronNoteAPI.delete),
    getAllByWorkspaceId: new IPCHandler(
      false,
      ElectronNoteAPI.getAllByWorkspaceId,
    ),
    getById: new IPCHandler(false, ElectronNoteAPI.getById),
    update: new IPCHandler(false, ElectronNoteAPI.update),
    getDocument: new IPCHandler(false, ElectronNoteAPI.getDocument),
    setDocument: new IPCHandler(false, ElectronNoteAPI.setDocument),
    duplicate: new IPCHandler(false, ElectronNoteAPI.duplicate),
    export: new IPCHandler(false, ElectronNoteAPI.export),
    import: new IPCHandler(false, ElectronNoteAPI.import),
  },
  embed: {
    createFromLocalFile: new IPCHandler(
      false,
      ElectronEmbedAPI.createFromLocalFile,
    ),
    createFromArrayBuffer: new IPCHandler(
      false,
      ElectronEmbedAPI.createFromArrayBuffer,
    ),
    getById: new IPCHandler(false, ElectronEmbedAPI.getById),
  },
  workspace: {
    create: new IPCHandler(false, ElectronWorkspaceAPI.create),
    update: new IPCHandler(false, ElectronWorkspaceAPI.update),
    getAll: new IPCHandler(false, ElectronWorkspaceAPI.getAll),
    delete: new IPCHandler(false, ElectronWorkspaceAPI.delete),
  },
  settings: {
    getUserSettings: new IPCHandler(false, ElectronSettingsAPI.getUserSettings),
    saveUserSettings: new IPCHandler(
      false,
      ElectronSettingsAPI.saveUserSettings,
    ),
  },
  theme: {
    getThemes: new IPCHandler(false, ElectronThemeAPI.getThemes),
    importTheme: new IPCHandler(false, ElectronThemeAPI.importTheme),
  },
  onboarding: {
    isCompleted: new IPCHandler(false, hasOnboarded),
    isAlphaMigrationPerformed: new IPCHandler(false, isAlphaMigrationPerformed),
    markFinished: new IPCHandler(false, markOnboardingCompleted),
    migrateToV1: new IPCHandler(false, migrateAlphaToV1),
    isNewUser: new IPCHandler(false, isNewUser),
  },
  showAppMenu: new IPCHandler(false, showAppMenu),
  desktop: {
    getFontList: new IPCHandler(false, DesktopIntegration.getAvailableFonts),
    getSystemAccentColor: new IPCHandler(
      false,
      DesktopIntegration.getSystemAccentColor,
    ),
    getClientInfo: new IPCHandler(false, DesktopIntegration.getClientInfo),
  },
  checkUpdate: new IPCHandler(false, Updater.checkUpdate),
  backup: {
    initCache: new IPCHandler(false, HTMLExporterAPI.initializeExporterCache),
    pushFile: new IPCHandler(false, HTMLExporterAPI.pushToExporterCache),
    finishExport: new IPCHandler(false, HTMLExporterAPI.finishExport),
    chooseArchive: new IPCHandler(false, BackupAPI.openArchive),
    performBackup: new IPCHandler(false, BackupAPI.backup),
    restoreBackup: new IPCHandler(false, BackupAPI.restore),
  },
} satisfies DarkwriteAPI;
export type DarkwritePreloadAPI = InferPreloadAPI<typeof DarkwriteElectronAPI>;

const register = (
  channel: string,
  withEvent: boolean,
  listener: IPCMainListenerUnion,
  _ipcMain = ipcMain,
) => {
  try {
    if (withEvent) {
      _ipcMain.handle(channel, listener);
    } else {
      _ipcMain.handle(channel, (_event, ...args) => {
        return (<IPCMainListenerWithoutEvent>listener)(...args);
      });
    }
  } catch {
    log.error("Failed to register ", channel);
  }
};

const registerAPI = (
  channelPrefix: string,
  api: DarkwriteAPI = DarkwriteElectronAPI,
) => {
  const handlerKeys = recursiveKeys(api, (val) => val instanceof IPCHandler);
  for (const keyPath of handlerKeys) {
    const handler = find(api, keyPath) as IPCHandler<boolean>;
    const channel = channelPrefix.concat(".").concat(keyPath.join("."));
    register(channel, handler.withEvent, handler.listener);
  }
};

export const buildPreloadObject = (
  api: DarkwriteAPI = DarkwriteElectronAPI,
) => {
  const handlerKeys = recursiveKeys(api, (val) => val instanceof IPCHandler);
  const obj = {};
  // strip everything with true to replace in the prelaod script later
  for (const keyPath of handlerKeys) {
    deepAssign(obj, keyPath, true);
  }
  return obj;
};

export const InitializeElectronAPI = () => {
  ipcMain.handle("$darkwrite.build-preload-api-object", async () => {
    return buildPreloadObject();
  });
  registerAPI("api");
};
