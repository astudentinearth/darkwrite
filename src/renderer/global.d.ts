/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
interface Navigator{
    windowControlsOverlay?: WindowControlsOverlay;
}

/**
 * Type definition for WindowControlsOverlay API
 * https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
 */
interface WindowControlsOverlay extends EventTarget{
    visible: boolean;
    getTitlebarAreaRect(): DOMRect,
    ongeometrychange: ((this: WindowControlsOverlay, e: Event) => unknown) | null;
}