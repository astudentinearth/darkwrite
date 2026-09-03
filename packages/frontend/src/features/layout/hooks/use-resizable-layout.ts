import { useEffect, useRef } from "react";
import { clampSidebarWidth } from "../sidebar-metrics";

export interface ResizableSidebarOptions {
  min: number;
  max: number;
  /** Receives the new sidebar width, already clamped to [min, max]. */
  callback: (width: number) => void;
}

export const useResizableSidebar = ({
  min,
  max,
  callback,
}: ResizableSidebarOptions) => {
  const isResizing = useRef(false);

  // add event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      // the sidebar is the first element in the row, so the cursor position
      // is the width the user is asking for
      callback(clampSidebarWidth(e.clientX, { min, max }));
    };
    const handleMouseUp = () => (isResizing.current = false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [min, max, callback]);

  // enter resize mode if handle triggers mouse down
  const handleMouseDown = () => {
    isResizing.current = true;
  };

  return {
    isResizing,
    handleMouseDown,
  };
};
