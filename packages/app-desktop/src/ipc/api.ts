import {
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

export type NestedApiBridge = {
  [key: string]: IPCHandler<boolean> | NestedApiBridge;
};

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

const registerBridge = (channelPrefix: string, api: NestedApiBridge) => {
  recursiveKeys(api, (val) => val instanceof IPCHandler).forEach((keyPath) => {
    const handler = find(api, keyPath) as IPCHandler<boolean>;
    const channel = channelPrefix.concat(".").concat(keyPath.join("."));
    registerHandler(channel, handler.withEvent, handler.listener);
  });
};

export const buildPreloadObject = (api: NestedApiBridge) => {
  const obj = {};
  recursiveKeys(api, (val) => val instanceof IPCHandler).forEach((keyPath) =>
    deepAssign(obj, keyPath, true),
  );
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
