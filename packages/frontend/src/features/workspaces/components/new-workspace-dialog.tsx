import { getDefaultWorkspaceConfiguration } from "@darkwrite/common";
import { t } from "i18next";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
  Button,
  type ControlledDialogProps,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/components/ui";
import { useAppDispatch } from "@/features/store/hooks";
import { useWorkspaceManager } from "@/features/workspaces/hooks/use-workspace-manager";
import { createWorkspace } from "../store/workspace.thunk";

export default function NewWorkspaceDialog(
  props: ControlledDialogProps & { children: ReactNode },
) {
  const [name, setName] = useState("");
  const manager = useWorkspaceManager();
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const workspace = await dispatch(
      createWorkspace({
        name,
        config: getDefaultWorkspaceConfiguration(),
      }),
    );
    if (workspace.isErr()) {
      toast.error(
        `${t("sidebar.workspace.newWorkspaceError")}: ${workspace.error}`,
      );
      return;
    }
    manager.switchWorkspace(workspace.value.workspace.id);
    setName("");
    props.onOpenChange(false);
  };
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="flex flex-col max-w-96">
        <DialogTitle>Create new workspace</DialogTitle>
        <Label htmlFor="input-new-workspace-name" className="opacity-80">
          Name
        </Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="input-new-workspace-name"
          placeholder="Workspace name"
        />
        <div className="grid grid-cols-[1fr_1fr] gap-2">
          <Button
            onClick={() => handleCreate().finally(() => setLoading(false))}
            className="transition-opacity duration-75"
            disabled={name.trim().length < 1 || isLoading}
          >
            Create workspace
          </Button>
          <Button onClick={() => props.onOpenChange(false)} variant={"ghost"}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
