import { cn } from "@/lib/utils";
import { useNoteListState } from "../hooks/use-note-list-state";
import { NoteListItem } from "./note-list-item";
import { useMemo } from "react";

export interface NoteListProps {
  className?: string;
  parentId: string | null;
}

export default function NoteList(props: NoteListProps) {
  const state = useNoteListState(props.parentId);

  const items = useMemo(() => {
    return state.noteIds.map((id) => (
      <NoteListItem id={id} key={id}>
        <NoteList parentId={id} />
      </NoteListItem>
    ));
  }, [state.noteIds]);

  return <div className={cn("flex flex-col", props.className)}>{items}</div>;
}
