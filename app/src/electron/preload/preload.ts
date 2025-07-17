import { deepAssign, recursiveKeys } from "@common/object";
import { contextBridge, ipcRenderer, webUtils } from "electron";
// import { DarkwriteElectronAPI } from "../ipc/api";
// import { DarkwriteAPI, IPCHandler } from "../ipc/handler";

/**
 * Wraps around ipcRenderer.invoke() to type APIs
 * @template T Expected return type of invocation. This method's return type will be a Promise of that type.
 * @param channel IPC channel which will be handled
 * @param args Every other parameter which will be passed into ipcRenderer.invoke()
 * @returns
 */
const invoke = <T = void>(channel: string, ...args: unknown[]): Promise<T> =>
  <Promise<T>>ipcRenderer.invoke(channel, ...args);

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
  // et the list of IPC channels, which are derived from the object's keys
  const handlerKeys = recursiveKeys(apiObject, (val) => val === true);
  const obj = {};
  for (const keyPath of handlerKeys) {
    const channel = "api".concat(".").concat(keyPath.join("."));
    const handlerFunc = async (...args: unknown[]) => {
      const result = await invoke<unknown>(channel, ...args);
      return result;
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