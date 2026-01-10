import { useMemo } from "react";
import { useChildren, useOrderHints } from "./note-store";
import NoteItem from "./note-item";
import NoteDropZone from "./note-drop-zone";

export interface NoteListProps {
  parentId: string | null | undefined;
  className?: string;
}

export function NoteList2(props: NoteListProps) {
  const notes = useChildren(props.parentId ?? null);
  const { finalHint, getHintBetween, leadingHint } = useOrderHints(
    props.parentId ?? null,
  );

  const items = useMemo(
    () =>
      notes.map((note, i) => {
        return (
          <>
            <NoteItem key={note.id} note={note} />
            <NoteDropZone
              key={`dropzone-${i}`}
              parentId={props.parentId ?? null}
              orderHint={notes.length === i + 1 ? finalHint : getHintBetween(i)}
            />
          </>
        );
      }),
    [notes],
  );

  return (
    <div className="select-none">
      <NoteDropZone
        parentId={props.parentId ?? null}
        key={"drop-leading"}
        orderHint={leadingHint}
      />
      {items}
    </div>
  );
}
