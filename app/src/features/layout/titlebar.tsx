import { HeaderbarButton } from "@/components/headerbar-button";
import { cn } from "@/lib/utils";
import { PanelRightClose } from "lucide-react";
import { RefObject } from "react";
import { HistoryNavigation } from "./navigation";
import PageTitle from "./page-title";
import Toolbar from "./toolbar";

export type TitlebarProps = React.HTMLAttributes<HTMLDivElement> & {
  refObject: RefObject<HTMLDivElement | null>;
  expandCallback: () => void;
  isSidebarCollapsed: boolean;
};

export function Titlebar(props: TitlebarProps) {
  return (
    <div
      ref={props.refObject}
      className="titlebar h-12 bg-background shrink-0 flex [&>div]:shrink-0 p-2 justify-start gap-2 items-center"
    >
      <HeaderbarButton
        data-testid="button-expand-sidebar"
        className={cn(!props.isSidebarCollapsed && "hidden")}
        onClick={props.expandCallback}
        title="Show sidebar"
      >
        <PanelRightClose width={20} height={20}></PanelRightClose>
      </HeaderbarButton>
      <HistoryNavigation />
      <PageTitle/>
      <div className="grow"></div>
      <Toolbar/>
    </div>
  );
}
