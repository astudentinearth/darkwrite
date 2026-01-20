import { cn } from "@/lib/utils";
import { useNoteListState } from "../hooks/use-note-list-state";
import { NoteListItem } from "./note-list-item";

export interface NoteListProps {
  className?: string;
  parentId: string | null;
}

export default function NoteList(props: NoteListProps) {
  const state = useNoteListState(props.parentId);

  return (
    <div className={cn("flex flex-col", props.className)}>
      {state.noteIds.map((id) => (
        <NoteListItem id={id} key={id}>
          <NoteList parentId={id} />
        </NoteListItem>
      ))}
    </div>
  );
}
