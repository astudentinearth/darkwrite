import _ from "lodash";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { selectNotesToMoveInto } from "../store/note-selectors";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";
import { selectMoveNoteDialogState } from "../store/notes-ui-selectors";

export function useMoveNoteDialog() {
  const { open, noteId } = useAppSelector(selectMoveNoteDialogState);
  const workspaceId = useCurrentWorkspaceId() ?? "";
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();

  const { hideMoveNoteDialog, showMoveNoteDialog } =
    MoveNoteDialogPortal(dispatch);

  const results = useAppSelector((s) =>
    selectNotesToMoveInto(s, {
      query,
      workspaceId,
      targetNoteId: noteId ?? "",
    }),
  );

  return {
    open,
    showMoveNoteDialog,
    hideMoveNoteDialog,
    noteId,
    results,
    query,
    setQuery,
  };
}
