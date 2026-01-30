import ThemeHandler from "@/components/theme-handler";
import { Toaster } from "@/components/ui";
import { useLocalStore } from "@/context/local-state";
import { Sidebar } from "@/features/sidebar";
import { useShortcuts } from "@/hooks/use-shortcuts";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";
import NavigationHelper from "../navigation/navigation-helper";
import SearchDialog from "../search/search-dialog";
import SidebarResizeHandle from "./sidebar-resize-handle";
import { Titlebar } from "./titlebar";

//import { useStartup } from "@/hooks/use-startup";

export function Layout() {
  const isSidebarCollapsed = useLocalStore((s) => s.isSidebarCollapsed);

  useShortcuts();
  return (
    <div className="flex [&>div]:shrink-0 w-full h-full bg-background overflow-hidden [--slide-distance:32px]">
      <ThemeHandler />
      <NavigationHelper />
      <Sidebar></Sidebar>
      <SidebarResizeHandle />
      <div className="h-full flex flex-col grow overflow-hidden">
        <Titlebar></Titlebar>
        <div
          className={cn(
            "bg-view-1 h-full overflow-x-hidden main-view transition-[margin,border] duration-150 border-border/25 ml-0 mb-1.5 mr-1.5 rounded-md rounded-br-sm border",
            isSidebarCollapsed && "m-0 rounded-none border-transparent",
          )}
        >
          <SearchDialog />
          <Toaster />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
