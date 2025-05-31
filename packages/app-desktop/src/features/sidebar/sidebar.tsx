import { Button } from "@darkwrite/ui";
import { cn } from "@renderer/lib/utils";
import { LayoutDashboard, PanelRightOpen, Search } from "lucide-react";
import { NotesWidget } from "./notes";
import { NavigationWidget } from "./navigation";
import { showAppMenu } from "@renderer/lib/app-menu";
import CreatePageButton from "./create-page-button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { FavortiesWidget } from "./favorites";
import { TrashWidget } from "./trash";
import { SearchDialog } from "../search";
import { useState } from "react";
import { HeaderbarButton } from "@renderer/components/ui/headerbar-button";

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
      <ScrollArea className="h-full px-3 py-0">
        <div className="flex gap-2 flex-col mb-2">
          <CreatePageButton />
          <NavigationWidget />
          <FavortiesWidget />
          <NotesWidget />
          <TrashWidget />
        </div>
      </ScrollArea>
      <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
