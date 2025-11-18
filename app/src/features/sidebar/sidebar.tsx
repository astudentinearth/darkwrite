import { showAppMenu } from "@/api/appmenu";
import { HeaderbarButton } from "@/components/headerbar-button";
import { Button } from "@/components/ui/button";
import NoteListRoot from "@/features/note/note-list-root";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PanelRightOpen, Search } from "lucide-react";
import React from "react";
import { CreatePageButton } from "./create-page-button";
import FavoritesContainer from "./favorites-container";
import { SidebarNavigation } from "./navigation";
import { TrashWidget } from "./trash";
import { WorkspaceSwitcher } from "./workspace-switcher";

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  collapsed?: boolean;
  width: number;
  collapseCallback: () => void;
};

export function Sidebar(props: SidebarProps) {
  const { width, collapseCallback } = props;
  //const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div
      data-testid="container-sidebar"
      className={cn("bg-background h-full flex flex-col", props.className)}
      style={{ width: `${width}px` }}
    >
      <div className="titlebar w-full h-12 bg-background shrink-0 flex [&>button]:shrink-0 p-2 items-center gap-1">
        <HeaderbarButton
          onClick={() => {
            showAppMenu();
          }}
          data-testid="button-darkwrite"
          className="opacity-90"
          title="Menu"
        >
          <img src="darkwrite_icon.png" className="shrink-0 w-5 h-5"></img>
        </HeaderbarButton>
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
          //onClick={() => setSearchOpen(true)}
        >
          <Search width={18} height={18} />
        </HeaderbarButton>
        <HeaderbarButton
          data-testid="button-collapse-sidebar"
          onClick={collapseCallback}
          title="Hide sidebar"
        >
          <PanelRightOpen width={18} height={18} />
        </HeaderbarButton>
      </div>
      <div className="h-full w-full grow pl-3 pr-2 py-0 overflow-y-auto scroll-view">
        <div className="flex gap-2 flex-col mb-16 max-w-full">
          <WorkspaceSwitcher />
          <CreatePageButton />
          <SidebarNavigation />
          <FavoritesContainer />
          <NoteListRoot />
          <div className="flex flex-col gap-0.5">
            <TrashWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
