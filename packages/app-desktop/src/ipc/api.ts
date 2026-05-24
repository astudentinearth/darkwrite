import { showAppMenu } from "@/menu";
import {
  InferPreloadAPI,
  IPCHandler,
  IPCMainListenerUnion,
  IPCMainListenerWithoutEvent,
} from "@/types";
import {
  deepAssign,
  find,
  recursiveKeys,
  serializeResult,
} from "@darkwrite/common";
import { ipcMain } from "electron";
import log from "electron-log";
import { isNewUser, markOnboardingCompleted } from "../lib/onboarding-state";
import { Updater } from "../lib/update";
import { NoteApiBridge } from "../note/note.handler";

export type NestedApiBridge = {
  [key: string]: IPCHandler<boolean> | NestedApiBridge;
};

// remove handlers from this as they are migrated

/** @deprecated construct the object at init instead */
export const DarkwriteElectronAPI = {
  note: NoteApiBridge,
  onboarding: {
    isNewUser: new IPCHandler(false, isNewUser),
    markFinished: new IPCHandler(false, markOnboardingCompleted),
  },
  showAppMenu: new IPCHandler(false, showAppMenu),
  checkUpdate: new IPCHandler(false, Updater.checkUpdate),
} satisfies DarkwriteAPI;
export type DarkwritePreloadAPI = InferPreloadAPI<typeof DarkwriteElectronAPI>;

const registerHandler = (
  channel: string,
  withEvent: boolean,
  listener: IPCMainListenerUnion,
  _ipcMain = ipcMain,
) => {
  try {
    if (withEvent) {
      _ipcMain.handle(channel, async (event, ...args) => {
        return serializeResult(await listener(event, ...args));
      });
    } else {
      _ipcMain.handle(channel, async (_event, ...args) => {
        return serializeResult(
          await (listener as IPCMainListenerWithoutEvent)(...args),
        );
      });
    }
  } catch {
    log.error("Failed to register ", channel);
  }
};

const registerBridge = (channelPrefix: string, api: DarkwriteAPI) => {
  const handlerKeys = recursiveKeys(api, (val) => val instanceof IPCHandler);
  for (const keyPath of handlerKeys) {
    const handler = find(api, keyPath) as IPCHandler<boolean>;
    const channel = channelPrefix.concat(".").concat(keyPath.join("."));
    registerHandler(channel, handler.withEvent, handler.listener);
  }
};

export const buildPreloadObject = (api: NestedApiBridge) => {
  const handlerKeys = recursiveKeys(api, (val) => val instanceof IPCHandler);
  const obj = {};
  // strip everything with true to replace in the preload script later
  for (const keyPath of handlerKeys) {
    deepAssign(obj, keyPath, true);
  }
  return obj;
};

let initialized = false;

export function setupAPI(bridge: NestedApiBridge) {
  if (initialized) return;
  ipcMain.handle("$darkwrite.build-preload-api-object", () =>
    buildPreloadObject(bridge),
  );
  registerBridge("api", bridge);
  initialized = true;
}
