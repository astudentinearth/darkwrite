import { create } from "zustand";

/** Geometry of the Electron window controls overlay, in CSS pixels. */
export interface WindowControlsOverlayGeometry {
  visible: boolean;
  insetLeft: number;
  right: number;
}

interface LayoutStore {
  isFullscreen: boolean;
  wco: WindowControlsOverlayGeometry;
}

const HIDDEN_OVERLAY: WindowControlsOverlayGeometry = {
  visible: false,
  insetLeft: 0,
  right: 0,
};

export const useLayoutStore = create<LayoutStore>()(() => ({
  isFullscreen: false,
  wco: HIDDEN_OVERLAY,
}));

export const setIsFullscreen = (isFullscreen: boolean) => {
  useLayoutStore.setState({ isFullscreen });
};

export const setWcoGeometry = (wco: WindowControlsOverlayGeometry) => {
  const current = useLayoutStore.getState().wco;
  if (
    current.visible === wco.visible &&
    current.insetLeft === wco.insetLeft &&
    current.right === wco.right
  )
    return;
  useLayoutStore.setState({ wco });
};

export function setupLayoutEvents() {
  if (window.events) {
    window.events.onEnterFullScreen(() => {
      setIsFullscreen(true);
    });

    window.events.onExitFullScreen(() => {
      setIsFullscreen(false);
    });
  }
}
