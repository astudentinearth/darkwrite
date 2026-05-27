import type { WorkspaceDTO } from "@darkwrite/common";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  Label,
} from "@/components/ui";
import notify from "../notifications/notify";
import { useWorkspaceActions } from "../workspaces/store/workspace-actions";

export type DeleteWorkspaceDialogProps = {
  workspace: WorkspaceDTO;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  /** trigger component */
  children: ReactNode;
};

export function DeleteWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
  children,
}: DeleteWorkspaceDialogProps) {
  const [confirmName, setConfirmName] = useState("");
  const { t } = useTranslation("translation", {
    keyPrefix: "settings.workspace.deleteWorkspaceDialog",
  });

  const isConfirmed = confirmName === workspace.name;
  const { deleteWorkspace } = useWorkspaceActions();

  const handleOpenChange = (val: boolean) => {
    if (!val) setConfirmName("");
    onOpenChange(val);
  };

  const handleDelete = async () => {
    try {
      await deleteWorkspace(workspace.id);
      notify.success(t("successMessage"));
      handleOpenChange(false);
    } catch {
      notify.error(t("errorMessage"));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md!">
        <AlertDialogTitle>{t("title")}</AlertDialogTitle>
        <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        <div className="flex flex-col gap-2">
          <Label htmlFor="delete-workspace-confirm">
            {t("confirmLabel", { name: workspace.name })}
          </Label>
          <Input
            id="delete-workspace-confirm"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={workspace.name}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => handleOpenChange(false)}
            className="w-1/2"
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            disabled={!isConfirmed}
            className="w-1/2"
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
