import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WorkspaceLetterIcon } from "@/components/workspace-letter-icon";
import { useCurrentWorkspace, useWorkspacesQuery } from "@/query/use-workspace";
import { ChevronDown, Cloud, HardDrive, Plus } from "lucide-react";
import { WorkspaceItem } from "./workspace-item";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";
import { useWorkspaceManager } from "@/hooks/use-workspace-manager";

export function WorkspaceSwitcher() {
  const workspace = useCurrentWorkspace();
  const workspacesQuery = useWorkspacesQuery();
  const workspaces = workspacesQuery.data;
  const manager = useWorkspaceManager();
  const localWorkspaces = workspaces?.filter(
    (w) => w.config.syncMode === "offline" && w.id !== workspace?.id,
  );
  const t = useT("sidebar.workspace");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 w-fit overflow-hidden text-ellipsis whitespace-nowrap opacity-80 p-1 hover:bg-secondary/50 hover:opacity-100 rounded-[8px] select-none transition-[background,opacity] duration-75">
          {workspace && (
            <>
              <WorkspaceLetterIcon workspaceName={workspace.name} />
              <span className="ml-1 text-ellipsis text-sm overflow-hidden whitespace-nowrap">
                {workspace.name}
              </span>
              <ChevronDown className="shrink-0" size={18} />
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="ml-2 p-1 flex">
        <div className="w-full flex flex-col gap-2">
          {workspace && (
            <div className="p-1 flex flex-col gap-2">
              <div className="flex gap-3 items-center">
                <WorkspaceLetterIcon
                  className="w-10 h-10 text-xl"
                  workspaceName={workspace?.name}
                ></WorkspaceLetterIcon>
                <div>
                  <span>{workspace.name}</span>
                  <span className="flex gap-2 items-center text-sm text-popover-foreground/80">
                    {workspace.config.syncMode === "offline" ? (
                      <HardDrive size={18}></HardDrive>
                    ) : (
                      <Cloud size={18}></Cloud>
                    )}
                    {t(workspace.config.syncMode)}
                  </span>
                </div>
              </div>
            </div>
          )}
          {localWorkspaces && localWorkspaces.length > 0 && (
            <>
              {" "}
              <hr></hr>
              <span className="pl-1 text-sm text-popover-foreground/80">
                {t("offlineHeading")}
              </span>
              {localWorkspaces
                ?.filter((w) => w.id !== workspace?.id)
                .map((w) => (
                  <WorkspaceItem
                    workspace={w}
                    active={w.id === workspace?.id}
                    onClick={()=>manager.switchWorkspace(w.id)}
                  />
                ))}
            </>
          )}
          <hr></hr>
          <Button variant="ghost">
            <Plus size={18}></Plus>
            {t("newWorkspace")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
