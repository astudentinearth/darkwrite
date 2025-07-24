import { HeaderbarButton } from "@/components/headerbar-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showAppMenu } from "@/api/appmenu";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Search, PanelRightOpen } from "lucide-react";
import React, { useState } from "react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { CreatePageButton } from "./create-page-button";
import { SidebarNavigation } from "./navigation";
import { Favorties } from "./favorites";
import { NoteList } from "./note-list";
import { ArchiveButton } from "./archive-button";
import { TrashWidget } from "./trash";

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  collapsed?: boolean;
  width: number;
  collapseCallback: () => void;
};

export function Sidebar(props: SidebarProps) {
  const { width, collapseCallback } = props;
  const [searchOpen, setSearchOpen] = useState(false);
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
          title="Menu"
        >
          <img src="icon64.png" className="shrink-0 w-5 h-5"></img>
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
          onClick={() => setSearchOpen(true)}
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
      <ScrollArea className="h-full pl-3 pr-2 py-0">
        <div className="flex gap-2 flex-col mb-2">
          <div className="grid grid-cols-[auto_32px] gap-2">
            <WorkspaceSwitcher />
            <CreatePageButton />
          </div>
          <SidebarNavigation />
          <Favorties />
          <NoteList />
          <div className="flex flex-col gap-0.5">
            <ArchiveButton />
            <TrashWidget />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
