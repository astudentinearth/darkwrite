import { WorkspaceDTO } from "@/common/dto/response/workspace.response";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger, Button, DialogClose, Input, Label } from "@/components/ui";
import { WorkspaceLetterIcon } from "@/components/workspace-letter-icon";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { Check, X } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

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
  const [name, setName] = useState(props.workspace.name);
  const [imageUrl, setImageUrl] = useState<string | undefined | null>(workspace.icon_url);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async () => {
    const updated = produce(workspace, draft => {
      draft.name = name;
      draft.icon_url = imageUrl;
    });
    console.log("saving workspace", updated);
    props.onSave(updated);
  }

  const cancel = () => {
    setName(workspace.name);
    setImageUrl(undefined);
    props.onOpenChange(false);
  }

  const updateImage = async () => {
    const embed = await uploadImage();
    setImageUrl(embed.url);
  }

  return <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
    {children ? <AlertDialogTrigger asChild>{children}</AlertDialogTrigger> : <AlertDialogTrigger>Edit workspace</AlertDialogTrigger>}
    <AlertDialogContent className={cn(className, "flex flex-col")}>
      <AlertDialogTitle>Edit workspace</AlertDialogTitle>
      <div className="flex w-full flex-col items-center gap-2">
        <Button onClick={updateImage} className="w-24 h-24 p-0 rounded-xl overflow-hidden" variant={"ghost"}>
          {imageUrl ? <img src={imageUrl} className="w-24 h-24 object-contain" /> :
            <WorkspaceLetterIcon workspaceName={name} className="w-24 h-24 text-4xl" />}
        </Button>
        <div className="flex gap-2">
          <Button variant={"outline"} onClick={updateImage} className="h-fit">Change icon</Button>
          <Button variant={"outline"} onClick={()=>setImageUrl(null)} className="h-fit">Remove icon</Button>
        </div>
      </div>
      <Label htmlFor={workspace.id + "-name"}>Workspace name</Label>
      <Input value={name} onChange={e => setName(e.target.value)} ref={nameRef} id={workspace.id + "-name"} placeholder="Workspace name" />
      <div className="w-full grid grid-cols-[1fr_1fr] gap-2">

        <Button variant={"secondary"} onClick={handleSave}><Check size={18} />Save</Button>
        <Button onClick={cancel} variant={"ghost"}><X size={18} />Cancel</Button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
}

