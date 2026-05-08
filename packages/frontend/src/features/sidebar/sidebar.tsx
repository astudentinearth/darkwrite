import { HeaderbarButton } from "@/components/headerbar-button";
import { Button } from "@/components/ui/button";
import { TextTooltip } from "@/components/ui/tooltip";
import NoteListRoot from "@/features/note/note-list-root";
import { useSidebar } from "@/features/layout/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PanelRightOpen, Search } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { showSearch } from "../search/search-state";
import AppMenu from "./app-menu";
import { SidebarNavigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { CreatePageButton } from "./create-page-button";
import FavoritesContainer from "./favorites-container";
import { TrashWidget } from "../note/components/trash";

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {};

export function Sidebar(props: SidebarProps) {
  const { width, setSidebarCollapsed, isSidebarCollapsed } = useSidebar();
  const { t } = useTranslation();
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
          aria-label={t("sidebar.button.editSidebar")}
          disabled
        >
          <LayoutDashboard width={18} height={18} />
        </Button>
        <TextTooltip text={t("sidebar.button.search")}>
          <HeaderbarButton
            data-testid="button-search"
            aria-label={t("sidebar.button.search")}
            onClick={() => showSearch()}
          >
            <Search width={18} height={18} />
          </HeaderbarButton>
        </TextTooltip>
        <TextTooltip text={t("sidebar.button.hideSidebar")}>
          <HeaderbarButton
            data-testid="button-collapse-sidebar"
            onClick={() => setSidebarCollapsed(true)}
            aria-label={t("sidebar.button.hideSidebar")}
          >
            <PanelRightOpen width={18} height={18} />
          </HeaderbarButton>
        </TextTooltip>
      </div>
      <div className="h-full w-full grow pl-large pr-small py-0 overflow-y-auto scroll-view gutter-stable">
        <div className="flex gap-2 flex-col mb-16 max-w-full">
          <WorkspaceSwitcher />
          <CreatePageButton />
          <SidebarNavigation />
          <FavoritesContainer />
          <NoteListRoot />
          <div className="flex flex-col gap-0.5"></div>
          <TrashWidget />
        </div>
      </div>
    </div>
  );
}
