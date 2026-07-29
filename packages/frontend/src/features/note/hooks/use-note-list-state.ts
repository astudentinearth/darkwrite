import { shallowEqual } from "react-redux";
import { useAppSelector } from "@/features/store/hooks";
import { selectNotesByParentId } from "../store/note-selectors";

const EMPTY_ARRAY: string[] = [];

export function useNoteListState(parentId: string | null) {
  const workspaceId = useAppSelector((state) => state.session.workspaceId);
  const noteIds = useAppSelector(
    (state) =>
      workspaceId
        ? selectNotesByParentId(state, workspaceId, parentId)
        : EMPTY_ARRAY,
    shallowEqual,
  );

  return {
    noteIds,
  };
}
