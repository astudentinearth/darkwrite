/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="./electron/preload/types.d.ts"/>

import { DarkwriteIPCBridge, ElectronWebUtils} from "@darkwrite/common";

/**
 * Type definition for WindowControlsOverlay API
 * https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
 */
interface WindowControlsOverlay extends EventTarget {
  visible: boolean;
  getTitlebarAreaRect(): DOMRect;
  ongeometrychange: ((this: WindowControlsOverlay, e: Event) => unknown) | null;
}

type APIType = InferPreloadAPI<typeof NewAPI>;

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
    initPreload: PreloadInitFunction;
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
    events: {
      onEnterFullScreen: (callback: () => void) => void;
      onExitFullScreen: (callback: () => void) => void;
    };
  }

  interface Navigator {
    windowControlsOverlay?: WindowControlsOverlay;
  }

  type Result<T, E> =
    | { value: T; error?: undefined }
    | { value?: undefined; error: E };

  //type DarkwriteElectronAPI = dw;
}
