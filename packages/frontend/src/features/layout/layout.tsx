import ThemeHandler from "@/components/theme-handler";
import { Toaster } from "@/components/ui";
import { useLocalStore } from "@/context/local-state";
import { Sidebar } from "@/features/sidebar";
import { useShortcuts } from "@/features/ui/hooks/use-shortcuts";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";
import NavigationHelper from "../navigation/navigation-helper";
import SearchDialog from "../search/search-dialog";
import SidebarResizeHandle from "./sidebar-resize-handle";
import { Titlebar } from "./titlebar";
import MoveNoteDialog from "../note/components/move-note-dialog";
import { ClearTrashDialog } from "../trash/components/clear-trash-dialog";
import { NativeContextMenuProvider } from "../context-menu/native-context-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppMenuHandler } from "../app-menu/app-menu-handler";

//import { useStartup } from "@/hooks/use-startup";

export function Layout() {
  const isSidebarCollapsed = useLocalStore((s) => s.isSidebarCollapsed);

  useShortcuts();
  return (
    <>
      <div
        className={cn(
          "flex [&>div]:shrink-0 w-full h-full bg-background overflow-hidden [--slide-distance:32px]",
          isSidebarCollapsed && "bg-(--dw-editor-background)",
        )}
      >
        <TooltipProvider>
          <ThemeHandler />
          <NativeContextMenuProvider />
          <AppMenuHandler />
          <NavigationHelper />
          <Sidebar></Sidebar>
          <SidebarResizeHandle />
          <div className="h-full flex flex-col grow overflow-hidden">
            <Titlebar></Titlebar>
            <div
              className={cn(
                "bg-view-1 h-full overflow-x-hidden scroll-view transition-[margin] duration-150 border-border/25 ml-0 mb-1.5 mr-1.5 rounded-md rounded-br-sm border",
                isSidebarCollapsed && "m-0 rounded-none border-0",
              )}
            >
              <SearchDialog />
              <MoveNoteDialog />
              <ClearTrashDialog />
              <Outlet />
            </div>
          </div>
        </TooltipProvider>
      </div>
      <Toaster />
    </>
  );
}
