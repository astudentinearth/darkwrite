import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger, Button, DialogClose, Input, Label } from "@/components/ui";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { ReactNode, useRef } from "react";

export type EditWorkspaceDialogProps = {
  className?: string;
  workspace: WorkspaceDTO;
  onSave: (workspace: WorkspaceDTO) => void;
  children?: ReactNode;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function EditWorkspaceDialog(props: EditWorkspaceDialogProps) {
  const { className, workspace, children } = props;
  const nameRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async ()=> {
    if(!nameRef.current) return;
    const name = nameRef.current.value;
    const updated = produce(workspace, draft => {draft.name = name});
    console.log("saving workspace", updated);
    props.onSave(updated);
  }

  return <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
    {children ? <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> : <AlertDialogTrigger>Edit workspace</AlertDialogTrigger>}
    <AlertDialogContent className={cn(className, "flex flex-col")}>
      <AlertDialogTitle>Edit workspace</AlertDialogTitle>
      <Label htmlFor={workspace.id + "-name"}>Workspace name</Label>
      <Input defaultValue={workspace.name} ref={nameRef} id={workspace.id + "-name"} placeholder="Workspace name" />
        <Button onClick={handleSave}>Save</Button>
    </AlertDialogContent>
  </AlertDialog>
}

