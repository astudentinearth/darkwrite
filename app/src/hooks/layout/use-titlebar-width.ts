import { RefObject } from "react";

export const useTitlebarWidth = (
  headerRef: RefObject<HTMLDivElement | null>,
  isSidebarCollapsed: boolean,
  sidebarWidth: number,
) => {
  return () => {
    if (window.navigator.windowControlsOverlay == null || !headerRef.current)
      return; // check if electron gave us the object
    if (!window.navigator.windowControlsOverlay.visible) return; // we don't care if there is no overlay
    const rect = window.navigator.windowControlsOverlay.getTitlebarAreaRect();
    let headerWidth: number = 0;
    if (isSidebarCollapsed) {
      headerWidth = rect.width;
    } // if the sidebar is collapsed we take all space
    else {
      headerWidth = rect.width - (sidebarWidth + 1);
    } // if the sidebar is visible we take the sidebar out
    headerRef.current.style.width = `${headerWidth}px`;
  };
};
