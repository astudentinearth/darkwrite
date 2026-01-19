import { useGetNotesByParentIdQuery } from "../store/notes-api";
import { useAppSelector } from "@/features/store/hooks";
import { selectNotesByParentId } from "../store/note-selectors";
import { cn } from "@/lib/utils";

export interface NoteListProps {
  className?: string;
  parentId: string | null;
}

const EMPTY_ARRAY: string[] = [];

function useNoteListState(parentId: string | null) {
  const workspaceId = useAppSelector((state) => state.session.workspaceId);

  const { isLoading, isFetching } = useGetNotesByParentIdQuery({
    parentId,
    workspaceId: workspaceId ?? "",
  });

  const noteIds = useAppSelector((state) =>
    workspaceId
      ? selectNotesByParentId(state, workspaceId, parentId)
      : EMPTY_ARRAY,
  );

  return {
    noteIds,
    isLoading,
    isFetching,
  };
}

export default function NoteList(props: NoteListProps) {
  const state = useNoteListState(props.parentId);

  return (
    <div className={cn("flex flex-col gap-2", props.className)}>
      {state.noteIds.map((id) => (
        <div>{id}</div>
      ))}
    </div>
  );
}
