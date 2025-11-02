import { NoteDTO } from "@/common/dto";
import { Rank } from "@/common/rank";
import { useT } from "@/hooks/useT";
import { ReactNode, useMemo } from "react";
import NoteDropZone from "./note-drop-zone";
import NoteItem from "./note-item";

export default function NoteList(props: {
  leadingOrderHint: string;
  finalOrderHint: string;
  notes: NoteDTO[];
  parentId: string | null;
}) {
  const { notes } = props;
  const t = useT("sidebar.notes");

  const items = useMemo(() => {
    console.log("!!! RE-RENDERING LIST");
    if (notes.length === 0)
      return <span className="text-foreground/70">{t("noPages")}</span>;
    const nodes: ReactNode[] = [];

    nodes.push(
      <NoteDropZone
        parentId={props.parentId}
        key={"drop-leading"}
        orderHint={props.leadingOrderHint}
      />,
    );

    for (let i = 0; i < notes.length; i++) {
      if (notes[i].isTrashed) continue;
      const noteItem = <NoteItem key={notes[i].id} note={notes[i]} />;
      nodes.push(noteItem);

      if (i === notes.length - 1) {
        nodes.push(
          <NoteDropZone
            parentId={props.parentId}
            key={`dropzone-${props.finalOrderHint}`}
            orderHint={props.finalOrderHint}
          />,
        );
        break;
      }

      const thisOrderHint = new Rank(notes[i].orderHint);
      const nextOrderHint = new Rank(notes[i + 1].orderHint);
      const dropHint = thisOrderHint.between(nextOrderHint).toString();
      nodes.push(
        <NoteDropZone
          parentId={props.parentId}
          key={`dropzone-${dropHint}`}
          orderHint={dropHint}
        />,
      );
    }

    return nodes;
  }, [notes, props.finalOrderHint, props.leadingOrderHint, props.parentId, t]);

  return <div className="select-none">{items}</div>;
}
