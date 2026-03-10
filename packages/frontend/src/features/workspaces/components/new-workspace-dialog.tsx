import {
  Button,
  ControlledDialogProps,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/components/ui";
import { ReactNode, useState } from "react";
import { getDefaultWorkspaceConfiguration } from "@darkwrite/common";
import { useWorkspaceManager } from "@/features/workspaces/hooks/use-workspace-manager";
import { useCreateWorkspaceMutation } from "../store/workspace-api";
import { toast } from "sonner";
import { t } from "i18next";

export default function NewWorkspaceDialog(
  props: ControlledDialogProps & { children: ReactNode },
) {
  const [name, setName] = useState("");
  const [create, { isLoading }] = useCreateWorkspaceMutation();
  const manager = useWorkspaceManager();
  const handleCreate = async () => {
    const workspace = await create({
      name,
      config: getDefaultWorkspaceConfiguration(),
    });
    if (!workspace.data) {
      toast.error(
        t("sidebar.workspace.newWorkspaceError") + ": " + workspace.error,
      );
      return;
    }
    manager.switchWorkspace(workspace.data.id);
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
            onClick={handleCreate}
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
