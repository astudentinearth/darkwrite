import { useEffect } from "react";
import { setWcoGeometry } from "../layout-store";

/** Mirrors Window Controls Overlay layout to a shared store. */
export const useWindowControlsOverlay = () => {
  useEffect(() => {
    const overlay = window.navigator.windowControlsOverlay;
    if (!overlay) return; // WCO not enabled / native frame
    const sync = () => {
      if (!overlay.visible) {
        setWcoGeometry({ visible: false, insetLeft: 0, right: 0 });
        return;
      }
      const rect = overlay.getTitlebarAreaRect();
      setWcoGeometry({
        visible: true,
        insetLeft: rect.left,
        right: rect.right,
      });
    };
    sync();
    overlay.addEventListener("geometrychange", sync);
    return () => {
      overlay.removeEventListener("geometrychange", sync);
    };
  }, []);
};
