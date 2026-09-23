import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { searchCurrentWorkspace } from "../store/note-selectors";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";
import { selectMoveNoteDialogState } from "../store/notes-ui-selectors";
import { notesUiSlice } from "../store/notes-ui-slice";

export const useMoveNoteDialogState = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectMoveNoteDialogState);
  const setQuery = (q: string) =>
    dispatch(notesUiSlice.actions.setMoveNoteDialogQuery(q));
  const hideMoveNoteDialog = () =>
    dispatch(notesUiSlice.actions.closeMoveNoteDialog());
  return { ...state, setQuery, hideMoveNoteDialog };
};

export function useMoveNoteDialog() {
  const { open, noteId } = useAppSelector(selectMoveNoteDialogState);
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();

  const { hideMoveNoteDialog, showMoveNoteDialog } =
    MoveNoteDialogPortal(dispatch);

  const results = useAppSelector((s) =>
    searchCurrentWorkspace(s, query).filter((id) => id !== noteId),
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
