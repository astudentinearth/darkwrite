import { NoteType } from "@darkwrite/common";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "@/features/store/hooks";
import {
  selectNoteById,
  selectNotesByParentId,
  selectViewsOfDatabase,
} from "../store/note-selectors";
import { useGetNotesByParentIdQuery } from "../store/notes-api";

const EMPTY_ARRAY: string[] = [];

export function useNoteListState(parentId: string | null) {
  const workspaceId = useAppSelector(
    (state) => state.session.workspaceId ?? "",
  );
  const note = useAppSelector((s) =>
    parentId ? selectNoteById(s, parentId) : null,
  );

  const { isLoading, isFetching } = useGetNotesByParentIdQuery({
    parentId,
    workspaceId: workspaceId ?? "",
  });

  const noteIds = useAppSelector(
    (state) =>
      note?.type === NoteType.Doc || !parentId
        ? selectNotesByParentId(state, workspaceId, parentId)
        : selectViewsOfDatabase(state, parentId ?? ""),
    shallowEqual,
  );

  return {
    noteIds,
    isLoading,
    isFetching,
  };
}
