import { cn } from "@/lib/utils";
import { useNoteListState } from "../hooks/use-note-list-state";

export interface NoteListProps {
  className?: string;
  parentId: string | null;
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
