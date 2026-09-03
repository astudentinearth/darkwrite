import { IconLayoutSidebar } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { useLocalStore } from "@/context/local-state";
import { useNoteFromURL } from "@/features/note/hooks/use-note-from-url";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "./layout-store";
import { HistoryNavigation } from "./navigation";
import NoteDropdown from "./note-dropdown";
import PageTitle from "./page-title";
import Toolbar from "./toolbar";
import TrafficLightsPlaceholder from "./traffic-lights-placeholder";

export function Titlebar() {
  const isSidebarCollapsed = useLocalStore((s) => s.isSidebarCollapsed);
  const sidebarWidth = useLocalStore((s) => s.sidebarWidth);
  const wco = useLayoutStore((s) => s.wco);
  const { t } = useTranslation();
  const expandCallback = () => {
    useLocalStore.setState({ isSidebarCollapsed: false });
  };
  const noteId = useNoteFromURL();
  const overlayStyle = wco.visible
    ? {
        width: isSidebarCollapsed ? wco.right : wco.right - (sidebarWidth + 1),
        paddingLeft: isSidebarCollapsed ? wco.insetLeft + 8 : undefined,
      }
    : undefined;
  return (
    <div
      style={overlayStyle}
      className={cn(
        "titlebar h-12 bg-background shrink-0 flex [&>div]:shrink-0 p-2 justify-start gap-2 items-center",
        isSidebarCollapsed && "bg-view-1",
        isSidebarCollapsed &&
          noteId &&
          "bg-(--dw-editor-background) text-(--dw-editor-foreground)",
      )}
    >
      <TrafficLightsPlaceholder />
      <TextTooltip text={t("sidebar.button.showSidebar")}>
        <HeaderbarButton
          data-testid="button-expand-sidebar"
          className={cn(!isSidebarCollapsed && "hidden")}
          onClick={expandCallback}
          aria-label={t("sidebar.button.showSidebar")}
        >
          <IconLayoutSidebar size={18} />
        </HeaderbarButton>
      </TextTooltip>
      <HistoryNavigation />
      {noteId ? <NoteDropdown id={noteId} /> : <PageTitle />}
      <div className="grow"></div>
      {noteId && <Toolbar noteId={noteId} />}
    </div>
  );
}
