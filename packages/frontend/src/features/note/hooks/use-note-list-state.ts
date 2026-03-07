import { useAppSelector } from "@/features/store/hooks";
import { shallowEqual } from "react-redux";
import { selectNotesByParentId } from "../store/note-selectors";
import { useGetNotesByParentIdQuery } from "../store/notes-api";

const EMPTY_ARRAY: string[] = [];

export function useNoteListState(parentId: string | null) {
  const workspaceId = useAppSelector((state) => state.session.workspaceId);

  const { isLoading, isFetching } = useGetNotesByParentIdQuery({
    parentId,
    workspaceId: workspaceId ?? "",
  });

  const noteIds = useAppSelector(
    (state) =>
      workspaceId
        ? selectNotesByParentId(state, workspaceId, parentId)
        : EMPTY_ARRAY,
    shallowEqual,
  );

  return {
    noteIds,
    isLoading,
    isFetching,
  };
}
