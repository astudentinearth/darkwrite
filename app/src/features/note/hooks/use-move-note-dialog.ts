import { useAppDispatch, useAppSelector } from "@/features/store/hooks";
import { selectMoveNoteDialogState } from "../store/notes-ui-selectors";
import { MoveNoteDialogPortal } from "../store/notes-ui-actions";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { useLazySearchQuery } from "../store/search-api";
import { useMemo, useState } from "react";
import { selectNotesToMoveInto } from "../store/note-selectors";
import _ from "lodash";

export function useMoveNoteDialog() {
  const { open, noteId } = useAppSelector(selectMoveNoteDialogState);
  const workspaceId = useCurrentWorkspaceId() ?? "";
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const [triggerSearch, { isError, isFetching, isLoading }] =
    useLazySearchQuery();

  const { hideMoveNoteDialog, showMoveNoteDialog } =
    MoveNoteDialogPortal(dispatch);

  const debouncedSearch = useMemo(
    () =>
      _.debounce((q: string) => triggerSearch({ workspaceId, query: q }), 150),
    [triggerSearch, workspaceId],
  );

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
    debouncedSearch,
    isError,
    isFetching,
    isLoading,
    query,
    setQuery(q: string) {
      setQuery(q);
      debouncedSearch(q);
    },
  };
}
