import {
  deepAssign,
  type NativeContextMenuData,
  recursiveKeys,
  type SerializedResult,
  type WindowEvents,
} from "@darkwrite/common";
import { contextBridge, ipcRenderer, webUtils } from "electron";
import { AppMenuEvent, WindowEvent } from "@/types/window-events";

/**
 * Wraps around ipcRenderer.invoke() to type APIs
 * @template T Expected return type of invocation. This method's return type will be a Promise of that type.
 * @param channel IPC channel which will be handled
 * @param args Every other parameter which will be passed into ipcRenderer.invoke()
 * @returns
 */
const invoke = <T = void, E = unknown>(
  channel: string,
  ...args: unknown[]
): Promise<SerializedResult<T, E>> =>
  <Promise<SerializedResult<T, E>>>ipcRenderer.invoke(channel, ...args);

let initialized = false;

/**
 * Requests a list of API handlers from the main process, then builds a wrapper object around them.
 * This function should be awaited before the frontend is rendered.
 */
export const initalizeAPI = async () => {
  if (initialized) return;
  // get a nested object in which all handler functions are equal to `true`
  const apiObject = await ipcRenderer.invoke(
    "$darkwrite.build-preload-api-object",
  );
  // get the list of IPC channels, which are derived from the object's keys
  const handlerKeys = recursiveKeys(apiObject, (val) => val === true);
  const obj = {};
  for (const keyPath of handlerKeys) {
    const channel = "api".concat(".").concat(keyPath.join("."));
    const handlerFunc = (...args: unknown[]) => {
      return invoke<unknown>(channel, ...args);
    };
    // replace each `true` with a wrapper to ipcRenderer.invoke
    deepAssign(obj, keyPath, handlerFunc);
  }
  // expose the API
  contextBridge.exposeInMainWorld("api", obj);
  initialized = true;
};

contextBridge.exposeInMainWorld("webUtils", webUtils);
contextBridge.exposeInMainWorld("initPreload", initalizeAPI);
contextBridge.exposeInMainWorld("isElectron", true);

const events: WindowEvents = {
  onEnterFullScreen: (callback: () => void) =>
    ipcRenderer.on(WindowEvent.ENTER_FULLSCREEN, () => callback()),
  onExitFullScreen: (callback: () => void) =>
    ipcRenderer.on(WindowEvent.EXIT_FULLSCREEN, () => callback()),
  onContextMenu: (callback: (data: NativeContextMenuData) => void) =>
    ipcRenderer.on(WindowEvent.CONTEXT_MENU, (_, data) => callback(data)),
  menu: {
    onCreateNote: (callback: () => void) =>
      ipcRenderer.on(AppMenuEvent.CREATE_NEW_NOTE, () => callback()),
  },
};

contextBridge.exposeInMainWorld("events", events);
