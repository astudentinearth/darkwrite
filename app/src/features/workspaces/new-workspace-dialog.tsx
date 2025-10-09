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
import { ReactNode, useRef, useState } from "react";
import useCreateWorkspace from "./use-create-workspace";
import { getDefaultWorkspaceConfiguration } from "@/lib/workspace-config";
import { useWorkspaceManager } from "@/hooks/use-workspace-manager";

export default function NewWorkspaceDialog(
  props: ControlledDialogProps & { children: ReactNode },
) {
  const [name, setName] = useState("");
  const createMutation = useCreateWorkspace();
  const manager = useWorkspaceManager();
  const handleCreate = async () => {
    const workspace = await createMutation.mutateAsync({name, config: getDefaultWorkspaceConfiguration()});
    manager.switchWorkspace(workspace.workspace.id);
    setName("");
    props.onOpenChange(false);
  }
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
          <Button onClick={handleCreate} className="transition-opacity duration-75" disabled={name.trim().length < 1 || createMutation.isPending}>Create workspace</Button>
          <Button onClick={()=>props.onOpenChange(false)} variant={"ghost"}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
