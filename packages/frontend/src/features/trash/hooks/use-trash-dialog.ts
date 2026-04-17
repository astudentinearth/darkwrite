import { ClearTrashDialogPortal } from "@/features/note/store/notes-ui-actions";
import { selectClearTrashDialogState } from "@/features/note/store/notes-ui-selectors";
import { useClearTrashMutation } from "@/features/note/store/trash-api";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";

export function useClearTrashDialog() {
  const { open } = useAppSelector((s) => selectClearTrashDialogState(s));
  const dispatch = useAppDispatch();
  const [trigger, { isLoading, isError }] = useClearTrashMutation();
  const workspaceId = useCurrentWorkspaceId();

  const { hideClearTrashDialog, showClearTrashDialog } =
    ClearTrashDialogPortal(dispatch);

  const clearTrash = async () => {
    if (!workspaceId) return;
    await trigger(workspaceId).unwrap();
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
