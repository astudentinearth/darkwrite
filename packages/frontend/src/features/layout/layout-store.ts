import { create } from "zustand";

interface LayoutStore {
  isFullscreen: boolean;
}

export const useLayoutStore = create<LayoutStore>()(() => ({
  isFullscreen: false,
}));

export const setIsFullscreen = (isFullscreen: boolean) => {
  useLayoutStore.setState({ isFullscreen });
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
