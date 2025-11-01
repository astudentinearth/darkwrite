import { Sidebar } from "@/features/sidebar";
import { useSidebar } from "@/hooks/layout/use-sidebar";
import { useWindowControlsOverlay } from "@/hooks/layout/use-window-controls-overlay";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { useResizableSidebar } from "../../hooks/layout/use-resizable-layout";
import { Titlebar } from "./titlebar";
import ThemeHandler from "@/components/theme-handler";
import { useShortcuts } from "@/hooks/use-shortcuts";

//import { useStartup } from "@/hooks/use-startup";

const [MIN_WIDTH, , MAX_WIDTH] = [180, 240, 300];

export function Layout() {
  const { isSidebarCollapsed, setWidth, width, setSidebarCollapsed } =
    useSidebar();
  const headerRef = useRef<HTMLDivElement>(null); // editor-side header bar
  const { handleMouseDown } = useResizableSidebar({
    min: MIN_WIDTH,
    max: MAX_WIDTH,
    callback: setWidth,
  });
  useWindowControlsOverlay(headerRef);
  useShortcuts();
  return (
    <div className="flex [&>div]:shrink-0 w-full h-full bg-background overflow-hidden [--slide-distance:32px]">
      <ThemeHandler />
      <Sidebar
        collapseCallback={() => {
          setSidebarCollapsed(true);
        }}
        collapsed={isSidebarCollapsed}
        width={width}
        className={cn(isSidebarCollapsed && "hidden")}
      ></Sidebar>
      <div
        data-testid="sidebar-resize-handle"
        onMouseDown={handleMouseDown}
        className={cn(
          "w-[1px] h-full flex cursor-ew-resize resize-handle relative",
          isSidebarCollapsed && "hidden",
        )}
      ></div>
      <div className="h-full flex flex-col grow overflow-hidden">
        <Titlebar
          refObject={headerRef}
          expandCallback={() => {
            setSidebarCollapsed(false);
          }}
          isSidebarCollapsed={isSidebarCollapsed}
        ></Titlebar>
        <div
          className={cn(
            "bg-view-1 h-full overflow-x-hidden main-view  border-border/25 ml-0 mb-1.5 mr-1.5 rounded-lg rounded-br-sm border",
            isSidebarCollapsed && "ml-1.5",
          )}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
