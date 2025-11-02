import { Rank } from "@/common/rank";
import { useLocalStore } from "@/context/local-state";
import { notesFetcher, NotesQueryData } from "@/query/use-notes";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export const useNoteChildren = (parentId: string | null) => {
  const workspaceId = useLocalStore((s) => s.workspaceId);
  const queryFn = useCallback(() => notesFetcher(workspaceId), [workspaceId]);
  const selectFn = useCallback(
    (notesQuery: NotesQueryData) => {
      console.log("Reselecting child notes");
      return Object.values(notesQuery.notes)
        .filter((n) => n.parentId == parentId && !n.isTrashed)
        .toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint));
    },
    [parentId],
  );
  return useQuery({
    queryKey: [workspaceId, "notes", "children", parentId],
    queryFn,
    select: selectFn,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
};
