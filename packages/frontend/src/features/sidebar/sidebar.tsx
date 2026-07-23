import { IconLayoutSidebar, IconSettings } from "@tabler/icons-react";
import { LayoutDashboard, Search } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { HeaderbarButton } from "@/components/headerbar-button";
import { Button } from "@/components/ui/button";
import { TextTooltip } from "@/components/ui/tooltip";
import { useSidebar } from "@/features/layout/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { FlatNoteList } from "../note/components/flat-note-list";
import { TrashWidget } from "../note/components/trash";
import { showSearch } from "../search/search-state";
import SettingsDialog from "../settings/settings-dialog";
import AppMenu from "./app-menu";
import { SidebarNavigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";

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
            <IconLayoutSidebar size={18} />
          </HeaderbarButton>
        </TextTooltip>
      </div>

      <div
        style={{
          boxShadow: "0px 8px 12px var(--background)",
        }}
        className="p-2 pt-0 gap-1 grid grid-cols-[1fr_auto] z-1 bg-background"
      >
        <SidebarNavigation />
      </div>
      <div className="h-full w-full grow pl-2 pr-2 py-2 overflow-y-auto scroll-view">
        <div className="flex gap-2 flex-col mb-16 max-w-full">
          <FlatNoteList />
        </div>
      </div>
      <div
        style={{
          boxShadow: "0px -8px 12px var(--background)",
        }}
        className="p-2 pb-3 gap-1 grid grid-cols-[1fr_auto] z-1 bg-background"
      >
        <TrashWidget />
        <WorkspaceSwitcher />
        <SettingsDialog>
          <Button
            variant="ghost"
            className="w-8 h-8 text-muted-foreground hover:bg-secondary/40"
          >
            <IconSettings size={18} />
          </Button>
        </SettingsDialog>
      </div>
    </div>
  );
}
