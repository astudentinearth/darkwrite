import { useGetRecentsByWorkspaceIdQuery } from "@/features/note/store/notes-api";
import { useAppSelector } from "@/features/store/hooks";
import { selectRecentNotes } from "@/features/note/store/note-selectors";
import { skipToken } from "@reduxjs/toolkit/query/react";

export default function useRecents(refetchOnMountOrArgChange = true) {
  const workspaceId = useAppSelector((state) => state.session.workspaceId);

  useGetRecentsByWorkspaceIdQuery(workspaceId ?? skipToken, {
    refetchOnMountOrArgChange,
  });

  const recents = useAppSelector((state) =>
    workspaceId ? selectRecentNotes(state, workspaceId) : [],
  );

  return { recents };
}
