import { HeaderbarButton } from "@/components/headerbar-button";
import { cn } from "@/lib/utils";
import { PanelRightClose } from "lucide-react";
import { RefObject, useRef } from "react";
import { HistoryNavigation } from "./navigation";
import PageTitle from "./page-title";
import Toolbar from "./toolbar";
import TrafficLightsPlaceholder from "./traffic-lights-placeholder";
import { useWindowControlsOverlay } from "@/hooks/layout/use-window-controls-overlay";
import { useLocalStore } from "@/context/local-state";
import { useNoteFromURL } from "@/query/use-note-from-url";

export function Titlebar() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isSidebarCollapsed = useLocalStore((s) => s.isSidebarCollapsed);
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
        isSidebarCollapsed && noteId && "bg-(--dw-editor-background)",
      )}
    >
      <TrafficLightsPlaceholder />
      <HeaderbarButton
        data-testid="button-expand-sidebar"
        className={cn(!isSidebarCollapsed && "hidden")}
        onClick={expandCallback}
        title="Show sidebar"
      >
        <PanelRightClose width={20} height={20}></PanelRightClose>
      </HeaderbarButton>
      <HistoryNavigation />
      <div className="grow"></div>
      <Toolbar />
    </div>
  );
}
