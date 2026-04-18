/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

import {
  DarkwriteIPCBridge,
  ElectronWebUtils,
  WindowEvents,
} from "@darkwrite/common";

/**
 * Type definition for WindowControlsOverlay API
 * https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
 */
interface WindowControlsOverlay extends EventTarget {
  visible: boolean;
  getTitlebarAreaRect(): DOMRect;
  ongeometrychange: ((this: WindowControlsOverlay, e: Event) => unknown) | null;
}

declare global {
  type Result<T, E> =
    | { value: T; error?: undefined }
    | { value?: undefined; error: E };

  interface Window {
    /**
     * Interface with the Electron main process.
     * @platform electron
     */
    api: DarkwriteIPCBridge;
    /**
     * Utility to get full paths of File objects in Electron windows.
     * @platform electron
     */
    webUtils: ElectronWebUtils;
    /** Initialize the IPC bridge. This is asynchronous and must be awaited before any API methods are called. */
    initPreload: () => Promise<void>;
    /**
     * This field will exist and be set to `true` if the application
     * is running inside an Electron container. This should not exist
     * at all in normal browsers;
     */
    isElectron: true | undefined;
    /**
     * Listen to events from the Electron main process.
     * @platform electron
     */
    events: WindowEvents;
  }

  interface Navigator {
    windowControlsOverlay?: WindowControlsOverlay;
  }

  type Result<T, E> =
    | { value: T; error?: undefined }
    | { value?: undefined; error: E };
}
