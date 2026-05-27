import { useTranslation } from "react-i18next";
import { ClearTrashDialogPortal } from "@/features/note/store/notes-ui-actions";
import { selectClearTrashDialogState } from "@/features/note/store/notes-ui-selectors";
import { useClearTrashMutation } from "@/features/note/store/trash-api";
import notify from "@/features/notifications/notify";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";

export function useClearTrashDialog() {
  const { open } = useAppSelector((s) => selectClearTrashDialogState(s));
  const dispatch = useAppDispatch();
  const [trigger, { isLoading, isError }] = useClearTrashMutation();
  const workspaceId = useCurrentWorkspaceId();
  const { t } = useTranslation("translation");

  const { hideClearTrashDialog, showClearTrashDialog } =
    ClearTrashDialogPortal(dispatch);

  const clearTrash = async () => {
    if (!workspaceId) return;
    try {
      await trigger(workspaceId).unwrap();
      notify.success(t("toast.clearTrash.success"));
    } catch {
      notify.error(t("toast.clearTrash.error"));
    }
    hideClearTrashDialog();
  };

  return {
    open,
    hideClearTrashDialog,
    showClearTrashDialog,
    clearTrash,
    isLoading,
    isError,
  };
}
