import { useEffect, useRef } from "react";
import { isClamped } from "@/lib/utils";

export interface ResizableSidebarOptions {
  min: number;
  max: number;
  callback: (change: number) => void;
}

export const useResizableSidebar = (opts: ResizableSidebarOptions) => {
  const initialX = useRef(0);
  const isResizing = useRef(false);
  // add event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      if (!isClamped(e.clientX, opts.min, opts.max)) return;
      const change = e.clientX - initialX.current; // calculate change in position
      opts.callback(change);
      initialX.current = e.clientX; // update initial position for next event
    };
    const handleMouseUp = () => (isResizing.current = false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // enter resize mode if handle triggers mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    initialX.current = e.clientX;
    isResizing.current = true;
  };

  return {
    isResizing,
    initialX,
    handleMouseDown,
  };
};
