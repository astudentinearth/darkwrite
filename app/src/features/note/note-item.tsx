import { NoteDTO } from "@/common/dto";
import { Rank } from "@/common/rank";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNotes } from "@/query/use-notes";
import { useMemo, useState } from "react";
import { NoteContextMenuContainer } from "./note-context-menu";
import NoteHeader from "./note-header";
import NoteList from "./note-list";

export default function NoteItem({ note }: { note: NoteDTO }) {
  const [open, setOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const { notes } = useNotes();
  const children =
    useMemo(
      () => Object.values(notes ?? {}).filter((n) => n.parentId === note.id && !n.isTrashed).toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint)),
      [notes, note.id],
    ) ?? [];

  const computeLeadingHint = () => {
    if (children.length === 0) return Rank.default().toString();
    const firstChildRank = new Rank(children[0].orderHint);
    return firstChildRank.prev().toString();
  };

  const computeFinalHint = () => {
    if (children.length === 0) return Rank.default().toString();
    const lastChildRank = new Rank(
      children[children.length - 1].orderHint,
    );
    return lastChildRank.next().toString();
  };

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        <NoteContextMenuContainer note={note} onOpenChange={setContextMenuOpen}>
          <NoteHeader
            finalOrderHint={computeFinalHint()}
            collapsible
            showCreate
            open={open}
            setOpen={setOpen}
            note={note}
            contextMenuOpen={contextMenuOpen}
          />
        </NoteContextMenuContainer>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-3">
        <NoteList
          parentId={note.id}
          notes={children}
          leadingOrderHint={computeLeadingHint()}
          finalOrderHint={computeFinalHint()}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
