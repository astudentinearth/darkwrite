import { RefObject, useEffect } from "react";
import { useSidebar } from "./use-sidebar";
import { useTitlebarWidth } from "./use-titlebar-width";

export const useWindowControlsOverlay = (
  headerRef: RefObject<HTMLDivElement | null>,
) => {
  const { isSidebarCollapsed, width } = useSidebar();
  const adjustTitlebarWidth = useTitlebarWidth(
    headerRef,
    isSidebarCollapsed,
    width,
  );
  // This effect must manage the event listener, or the event won't know about the sidebar. DO NOT REMOVE
  useEffect(() => {
    adjustTitlebarWidth();
    window.navigator.windowControlsOverlay?.addEventListener(
      "geometrychange",
      adjustTitlebarWidth,
    );
    return () => {
      window.navigator.windowControlsOverlay?.removeEventListener(
        "geometrychange",
        adjustTitlebarWidth,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarCollapsed, width]);
};
