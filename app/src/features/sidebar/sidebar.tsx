import { HeaderbarButton } from "@/components/headerbar-button";
import { Button } from "@/components/ui/button";
import NoteListRoot from "@/features/note/note-list-root";
import { useSidebar } from "@/features/layout/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PanelRightOpen, Search } from "lucide-react";
import React from "react";
import { showSearch } from "../search/search-state";
import AppMenu from "./app-menu";
import { SidebarNavigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { CreatePageButton } from "./create-page-button";
import { FavoritesView } from "../note/components/favorites";
import FavoritesContainer from "./favorites-container";

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {};

export function Sidebar(props: SidebarProps) {
  const { width, setSidebarCollapsed, isSidebarCollapsed } = useSidebar();
  return (
    <div
      data-testid="container-sidebar"
      className={cn(
        "bg-background h-full flex flex-col",
        isSidebarCollapsed && "hidden",
        props.className,
      )}
      style={{ width: `${width}px` }}
    >
      <div className="titlebar w-full h-12 bg-background shrink-0 flex [&>button]:shrink-0 p-2 items-center gap-1">
        <AppMenu />
        <div className="grow titlebar spacer"></div>
        <Button
          data-testid="button-edit-widgets"
          variant={"ghost"}
          className="shrink-0 hidden size-8"
          title="Edit sidebar"
          disabled
        >
          <LayoutDashboard width={18} height={18} />
        </Button>
        <HeaderbarButton
          data-testid="button-search"
          title="Search"
          onClick={() => showSearch()}
        >
          <Search width={18} height={18} />
        </HeaderbarButton>
        <HeaderbarButton
          data-testid="button-collapse-sidebar"
          onClick={() => setSidebarCollapsed(true)}
          title="Hide sidebar"
        >
          <PanelRightOpen width={18} height={18} />
        </HeaderbarButton>
      </div>
      <div className="h-full w-full grow pl-large pr-small py-0 overflow-y-auto scroll-view gutter-stable">
        <div className="flex gap-2 flex-col mb-16 max-w-full">
          <WorkspaceSwitcher />
          <CreatePageButton />
          <SidebarNavigation />
          <FavoritesContainer />
          <NoteListRoot />
          <div className="flex flex-col gap-0.5"></div>
        </div>
      </div>
    </div>
  );
}
