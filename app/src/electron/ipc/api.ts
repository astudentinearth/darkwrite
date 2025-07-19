import * as NoteAPI from "@main/api/note.electron";
import * as SettingsAPI from "@main/api/settings.electron";
import { ImportAPI as FileImportAPI } from "@main/api/import.electron";
import { ThemeAPI } from "@main/api/theme.electron";
import { deepAssign, find, recursiveKeys } from "@common/object";
import { ipcMain } from "electron";
import {
  IPCMainListenerUnion,
  IPCMainListenerWithoutEvent,
  DarkwriteAPI,
  InferPreloadAPI,
  IPCHandler,
} from "@main/types";
import { BackupAPI, HTMLExporterAPI } from "@main/api/backup.electron";
import { EmbedAPI } from "@main/api/embed.electron";
import { showAppMenu } from "@main/menu";
import { Updater } from "../api/update.electron";
import { ServiceContainer } from "../service-container";

export const DarkwriteElectronAPI = {
  note: {
    create: new IPCHandler(false, ServiceContainer.noteService.create)
  },
  showAppMenu: new IPCHandler(false, showAppMenu),
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
    console.log("Failed to register ", channel);
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
}
