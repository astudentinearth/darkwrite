import { useEffect } from "react";
import { useLocalStore } from "@/context/local-state";
import { useLayoutStore } from "../layout-store";
import {
  clampSidebarWidth,
  type SidebarWidthRange,
  sidebarWidthRange,
} from "../sidebar-metrics";

/** Derives sidebar insets from Window Controls Overlay rects. */
export const useSidebarWidthRange = (): SidebarWidthRange => {
  const insetLeft = useLayoutStore((s) =>
    s.wco.visible ? s.wco.insetLeft : 0,
  );
  return sidebarWidthRange(insetLeft);
};

/** Forces the sidebar width to the allowed range when the window controls change.
 * For example, if the user changes their button layout in KDE System Settings while
 * we are running, it will rescue the sidebar. */
export const useClampedSidebarWidth = () => {
  const { min, max } = useSidebarWidthRange();
  useEffect(() => {
    const { sidebarWidth, setSidebarWidth } = useLocalStore.getState();
    const clamped = clampSidebarWidth(sidebarWidth, { min, max });
    if (clamped !== sidebarWidth) setSidebarWidth(clamped);
  }, [min, max]);
};
