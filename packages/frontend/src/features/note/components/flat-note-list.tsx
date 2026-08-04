import { useNoteList } from "../hooks/use-note-list";
import { NoteItem } from "./note-item";

export function FlatNoteList() {
  const { items } = useNoteList();

  return (
    <div className="w-full">
      {items.map((item) => (
        <NoteItem item={item} key={`${item.id}-${item.type}-${item.depth}`} />
      ))}
    </div>
  );
}
