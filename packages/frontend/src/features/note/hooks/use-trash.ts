import { byUpdateTime } from "@darkwrite/common";
import { createSelector } from "@reduxjs/toolkit";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "@/features/store/hooks";
import type { RootState } from "@/features/store/types";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { selectAllNotes } from "../store/note-selectors";
import { useGetTrashedQuery } from "../store/trash-api";

export type SelectTrashedProps = {
  workspaceId: string;
  query?: string;
};

export const selectNotesForTrashView = createSelector(
  [
    selectAllNotes,
    (_state: RootState, props: SelectTrashedProps) => props.workspaceId,
    (_state: RootState, props: SelectTrashedProps) => props.query,
  ],
  (allNotes, workspaceId, query) => {
    const q = query?.toLowerCase() ?? "";
    return allNotes
      .filter(
        (n) =>
          n.workspaceId === workspaceId &&
          n.isTrashed &&
          (query ? n.title.toLowerCase().includes(q) : true),
      )
      .toSorted(byUpdateTime("desc"))
      .map((n) => n.id);
  },
);

export function useTrash(query?: string) {
  const workspaceId = useCurrentWorkspaceId();
  const { isLoading, isFetching } = useGetTrashedQuery(
    workspaceId ?? skipToken,
  );
  const noteIds = useAppSelector((state) =>
    selectNotesForTrashView(state, {
      workspaceId: workspaceId ?? "",
      query,
    }),
  );

  return {
    noteIds,
    isLoading,
    isFetching,
  };
}
