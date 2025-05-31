import { useLocalStore } from "@renderer/context/local-state";
import { useEffect, useState } from "react";

export const useCenteredLayout = (maxWidth: number = 960) => {
  const [width, setWidth] = useState(maxWidth);
  const sidebarWidth = useLocalStore((s) => s.sidebarWidth);
  const isSidebarCollapsed = useLocalStore((s) => s.isSidebarCollapsed);
  useEffect(() => {
    const handleResize = () => {
      // if sidebar is collapsed, we subtract its width
      // + 1px  for resize handle,
      // + 8px to prevent the scrollbar going off-screen
      // which gives remaining width for editor area
      const availableWidth =
        window.innerWidth - (isSidebarCollapsed ? 0 : sidebarWidth + 1) - 8;
      // if less than 960px is available, we give it all. if we have more than 960, we give 960
      if(maxWidth === 0) setWidth(availableWidth);
      else setWidth(availableWidth <= maxWidth ? availableWidth : maxWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarCollapsed, sidebarWidth, maxWidth]);
  return width;
};
