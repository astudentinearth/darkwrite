import { NoteDTO } from "@/common/dto";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNotes } from "@/query/use-notes";
import { LexoRank } from "lexorank";
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
      () => Object.values(notes ?? {}).filter((n) => n.parentId === note.id).toSorted((a, b) => a.orderHint.localeCompare(b.orderHint)),
      [notes, note.id],
    ) ?? [];

  const computeLeadingHint = () => {
    if (children.length === 0) return LexoRank.middle().toString();
    const firstChildRank = LexoRank.parse(children[0].orderHint);
    return firstChildRank.genPrev().toString();
  };

  const computeFinalHint = () => {
    if (children.length === 0) return LexoRank.middle().toString();
    const lastChildRank = LexoRank.parse(
      children[children.length - 1].orderHint,
    );
    return lastChildRank.genNext().toString();
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
