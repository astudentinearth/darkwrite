import { selectRecentNotes } from "@/features/note/store/note-selectors";
import { useAppSelector } from "@/features/store/hooks";

export default function useRecents() {
  const workspaceId = useAppSelector((state) => state.session.workspaceId);

  const recents = useAppSelector((state) =>
    workspaceId ? selectRecentNotes(state, workspaceId) : [],
  );

  return { recents };
}
