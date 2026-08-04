import { IconSelector } from "@tabler/icons-react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WorkspaceIcon from "@/components/workspace-icon";
import NewWorkspaceDialog from "@/features/workspaces/components/new-workspace-dialog";
import { useWorkspaceSwitcher } from "../workspaces/hooks/use-workspace-switcher";
import { WorkspaceItem } from "./workspace-item";

export function WorkspaceSwitcher() {
  const { switchWorkspace, currentWorkspace, localWorkspaces } =
    useWorkspaceSwitcher();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("translation", {
    keyPrefix: "sidebar.workspace",
  });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground w-full overflow-hidden text-ellipsis whitespace-nowrap opacity-80 p-1 hover:bg-secondary/50 hover:opacity-100 rounded-md select-none transition-[background,opacity] duration-75">
          {currentWorkspace && (
            <>
              <IconSelector className="shrink-0" size={18} />
              <WorkspaceIcon
                className="size-6 rounded-md"
                workspace={currentWorkspace}
              />
              <span className="ml-1 text-ellipsis text-sm overflow-hidden whitespace-nowrap">
                {currentWorkspace.name}
              </span>
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="ml-2 p-1 flex top-highlight rounded-lg">
        <div className="w-full flex flex-col">
          {currentWorkspace && (
            <div className="p-1 flex flex-col gap-2">
              <div className="flex gap-3 items-center">
                <WorkspaceIcon
                  className="w-10 h-10 rounded-md text-xl"
                  workspace={currentWorkspace}
                ></WorkspaceIcon>
                <div>
                  <span>{currentWorkspace.name}</span>
                  <span className="flex gap-2 items-center text-sm text-popover-foreground/80">
                    {t("currentWorkspace")}
                  </span>
                </div>
              </div>
            </div>
          )}
          {localWorkspaces && localWorkspaces.length > 0 && (
            <>
              <div className="h-2"></div>
              <hr></hr>
              <div className="h-2"></div>
              {localWorkspaces
                ?.filter((w) => w.id !== currentWorkspace?.id)
                .map((w) => (
                  <WorkspaceItem
                    workspace={w}
                    active={w.id === currentWorkspace?.id}
                    onClick={() => {
                      switchWorkspace(w.id);
                      setOpen(false);
                    }}
                  />
                ))}
            </>
          )}
          <NewWorkspaceDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button variant="ghost" className="h-fit p-1 gap-1.5 justify-start">
              <Plus size={24} className="scale-75"></Plus>
              {t("newWorkspace")}
            </Button>
          </NewWorkspaceDialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
