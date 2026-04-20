import { WorkspaceDTO } from "@darkwrite/common";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { WorkspaceLetterIcon } from "@/components/workspace-letter-icon";
import { uploadImage } from "@/lib/upload-image";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { Check, X } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getWorkspaceActions } from "../workspaces/store/workspace-actions";
import { useAppStore } from "../store/hooks";

export type EditWorkspaceDialogProps = {
  className?: string;
  workspace: WorkspaceDTO;
  onSave: (workspace: WorkspaceDTO) => void;
  children?: ReactNode;
  open: boolean;
  onOpenChange: (val: boolean) => void;
};

export default function EditWorkspaceDialog(props: EditWorkspaceDialogProps) {
  const { className, workspace, children } = props;
  const [name, setName] = useState(props.workspace.name);
  const store = useAppStore();
  const { getCurrentWorkspaceId } = getWorkspaceActions(store);
  const [imageUrl, setImageUrl] = useState<string | undefined | null>(
    workspace.iconUrl,
  );
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();
  const handleSave = async () => {
    const updated = produce(workspace, (draft) => {
      draft.name = name;
      draft.iconUrl = imageUrl;
    });
    props.onSave(updated);
  };

  const cancel = () => {
    setName(workspace.name);
    setImageUrl(undefined);
    props.onOpenChange(false);
  };

  const updateImage = async () => {
    const embed = await uploadImage(getCurrentWorkspaceId);
    setImageUrl(embed.url);
  };

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      {children ? (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      ) : (
        <AlertDialogTrigger>Edit workspace</AlertDialogTrigger>
      )}
      <AlertDialogContent className={cn(className, "flex flex-col max-w-md!")}>
        <AlertDialogTitle>
          {t("settings.workspace.editWorkspaceDialog.title")}
        </AlertDialogTitle>
        <div className="flex w-full flex-col items-center gap-2">
          <Button
            onClick={updateImage}
            className="w-24 h-24 p-0 rounded-xl overflow-hidden"
            variant={"ghost"}
          >
            {imageUrl ? (
              <img src={imageUrl} className="w-24 h-24 object-contain" />
            ) : (
              <WorkspaceLetterIcon
                workspaceName={name}
                className="w-24 h-24 text-4xl"
              />
            )}
          </Button>
          <div className="flex gap-2">
            <Button
              variant={"secondary"}
              onClick={updateImage}
              className="h-fit"
            >
              {t("settings.workspace.editWorkspaceDialog.changeIcon")}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => setImageUrl(null)}
              className="h-fit"
            >
              {t("settings.workspace.editWorkspaceDialog.removeIcon")}{" "}
            </Button>
          </div>
        </div>
        <Label htmlFor={workspace.id + "-name"}>
          {t("settings.workspace.editWorkspaceDialog.workspaceName")}
        </Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          ref={nameRef}
          id={workspace.id + "-name"}
          placeholder={t(
            "settings.workspace.editWorkspaceDialog.workspaceName",
          )}
        />
        <div className="w-full grid grid-cols-[1fr_1fr] gap-2">
          <Button onClick={cancel} variant={"secondary"}>
            <X size={18} />
            {t("settings.workspace.editWorkspaceDialog.cancel")}
          </Button>
          <Button
            variant={"default"}
            onClick={handleSave}
            className="top-highlight"
          >
            <Check size={18} />
            {t("settings.workspace.editWorkspaceDialog.save")}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
