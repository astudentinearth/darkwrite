interface Navigator{
    windowControlsOverlay?: WindowControlsOverlay;
}

/**
 * Type definition for WindowControlsOverlay API
 * https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
 */
interface WindowControlsOverlay{
    visible: boolean;
    getTitlebarAreaRect(): DOMRect,
    ongeometrychange: ((this: WindowControlsOverlay, e: Event) => unknown) | null;
}