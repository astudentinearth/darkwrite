import {
  clearTrashFailToast,
  clearTrashSuccessToast,
} from "@/features/note/note.toast";
import { clearTrash as clearTrashAction } from "@/features/note/store/note.thunk";
import { ClearTrashDialogPortal } from "@/features/note/store/notes-ui-actions";
import { selectClearTrashDialogState } from "@/features/note/store/notes-ui-selectors";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";

export function useClearTrashDialog() {
  const { open } = useAppSelector((s) => selectClearTrashDialogState(s));
  const dispatch = useAppDispatch();

  const { hideClearTrashDialog, showClearTrashDialog } =
    ClearTrashDialogPortal(dispatch);

  const clearTrash = () => {
    dispatch(clearTrashAction())
      .andTee(clearTrashSuccessToast)
      .orTee(clearTrashFailToast);
    hideClearTrashDialog();
  };

  return {
    open,
    hideClearTrashDialog,
    showClearTrashDialog,
    clearTrash,
  };
}
