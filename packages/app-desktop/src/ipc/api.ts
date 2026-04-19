import { deepAssign, find, recursiveKeys } from "@darkwrite/common";
import { showAppMenu } from "@/menu";
import {
  DarkwriteAPI,
  InferPreloadAPI,
  IPCHandler,
  IPCMainListenerUnion,
  IPCMainListenerWithoutEvent,
} from "@/types";
import { ipcMain } from "electron";
import log from "electron-log";
import { BackupApiBridge } from "../api/backup.electron";
import { DesktopIntegration } from "../lib/desktop-integration";
import { isNewUser, markOnboardingCompleted } from "../lib/onboarding-state";
import { Updater } from "../lib/update";
import { NoteApiBridge } from "../note/note.handler";
import { ElectronSettingsAPI } from "./settings.handler";
import { ElectronThemeAPI } from "./theme.handler";
import { WorkspacesApiBridge } from "../workspace/workspace.handler";
import { EmbedApiBridge } from "@/embed/embed.handler";
import { ContextMenuApiBridge } from "@/desktop-integration/context-menu.handler";

export const DarkwriteElectronAPI = {
  note: NoteApiBridge,
  embed: EmbedApiBridge,
  workspace: WorkspacesApiBridge,
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
    isNewUser: new IPCHandler(false, isNewUser),
    markFinished: new IPCHandler(false, markOnboardingCompleted),
  },
  showAppMenu: new IPCHandler(false, showAppMenu),
  desktop: {
    getFontList: new IPCHandler(false, DesktopIntegration.getAvailableFonts),
    getSystemAccentColor: new IPCHandler(
      false,
      DesktopIntegration.getSystemAccentColor,
    ),
    getClientInfo: new IPCHandler(false, DesktopIntegration.getClientInfo),
    contextMenu: ContextMenuApiBridge,
  },
  checkUpdate: new IPCHandler(false, Updater.checkUpdate),
  backup: BackupApiBridge,
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

let initialized = false;

export const InitializeElectronAPI = () => {
  if (initialized) return;
  ipcMain.handle("$darkwrite.build-preload-api-object", async () => {
    return buildPreloadObject();
  });
  registerAPI("api");
  initialized = true;
};
