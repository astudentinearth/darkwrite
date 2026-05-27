import { PanelRightClose } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { HeaderbarButton } from "@/components/headerbar-button";
import { TextTooltip } from "@/components/ui/tooltip";
import { useLocalStore } from "@/context/local-state";
import { useWindowControlsOverlay } from "@/features/layout/hooks/use-window-controls-overlay";
import { useNoteFromURL } from "@/features/note/hooks/use-note-from-url";
import { cn } from "@/lib/utils";
import { HistoryNavigation } from "./navigation";
import PageTitle from "./page-title";
import Toolbar from "./toolbar";
import TrafficLightsPlaceholder from "./traffic-lights-placeholder";

export function Titlebar() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isSidebarCollapsed = useLocalStore((s) => s.isSidebarCollapsed);
  const { t } = useTranslation();
  const expandCallback = () => {
    useLocalStore.setState({ isSidebarCollapsed: false });
  };
  useWindowControlsOverlay(headerRef);
  const noteId = useNoteFromURL();
  return (
    <div
      ref={headerRef}
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
          <PanelRightClose width={20} height={20}></PanelRightClose>
        </HeaderbarButton>
      </TextTooltip>
      <HistoryNavigation />
      <PageTitle />
      <div className="grow"></div>
      {noteId && <Toolbar noteId={noteId} />}
    </div>
  );
}
