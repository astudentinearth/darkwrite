import {
  IconLayoutSidebar,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
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
import { CreatePageButton } from "./create-page-button";
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
        <TextTooltip text={t("sidebar.button.search")}>
          <HeaderbarButton
            data-testid="button-search"
            aria-label={t("sidebar.button.search")}
            onClick={() => showSearch()}
          >
            <IconSearch width={18} height={18} />
          </HeaderbarButton>
        </TextTooltip>
        <TextTooltip text={t("sidebar.button.hideSidebar")}>
          <HeaderbarButton
            data-testid="button-collapse-sidebar"
            onClick={() => setSidebarCollapsed(true)}
            aria-label={t("sidebar.button.hideSidebar")}
          >
            <IconLayoutSidebar width={18} height={18} />
          </HeaderbarButton>
        </TextTooltip>
      </div>
      <div
        style={{ boxShadow: "0px 2px 12px var(--background)" }}
        className="flex flex-col z-1 px-2 pb-2 bg-background"
      >
        <CreatePageButton />
        <SidebarNavigation />
      </div>
      <FlatNoteList />
      <div
        style={{ boxShadow: "0px -2px 12px var(--background)" }}
        className="p-2 pb-2 gap-1 grid grid-cols-[1fr_auto] z-1 bg-background"
      >
        <TrashWidget />
        <WorkspaceSwitcher />
        <SettingsDialog>
          <Button
            variant="ghost"
            className="w-8 h-8 text-muted-foreground hover:bg-secondary/40 opacity-75 hover:opacity-100"
          >
            <IconSettings size={18} />
          </Button>
        </SettingsDialog>
      </div>
    </div>
  );
}
