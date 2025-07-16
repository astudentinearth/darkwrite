/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="./electron/preload/types.d.ts"/>

import { type WebUtils } from "electron";
import type { DarkwriteElectronAPI as NewAPI } from "./electron/ipc/api";
import { type InferPreloadAPI } from "./electron/types/ipc-handler";

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
    api: APIType;
    webUtils: WebUtils;
    initPreload: PreloadInitFunction;
    isElectron: true | undefined;
  }

  interface Navigator {
    windowControlsOverlay?: WindowControlsOverlay;
  }

  type Result<T, E> =
    | { value: T; error?: undefined }
    | { value?: undefined; error: E };

  //type DarkwriteElectronAPI = dw;
}
