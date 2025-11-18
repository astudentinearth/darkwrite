import { NoteDTO } from "@/common/dto";
import { Rank } from "@/common/rank";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import NoteHeader from "./note-header";
import NoteList from "./note-list";
import { useNoteChildren } from "./use-note-children";
import { NoteContextMenuContainer } from "./note-context-menu";

export default function NoteItem({ note }: { note: NoteDTO }) {
  const [open, setOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const children = useNoteChildren(note.id).data ?? [];

  const computeLeadingHint = () => {
    if (children.length === 0) return Rank.default().toString();
    const firstChildRank = new Rank(children[0].orderHint);
    return firstChildRank.prev().toString();
  };

  const computeFinalHint = () => {
    if (children.length === 0) return Rank.default().toString();
    const lastChildRank = new Rank(children[children.length - 1].orderHint);
    return lastChildRank.next().toString();
  };

  const finalOrderHint = computeFinalHint();

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        <NoteContextMenuContainer
          note={note}
          onOpenChange={setContextMenuOpen}
          finalOrderHint={finalOrderHint}
        >
          <NoteHeader
            finalOrderHint={finalOrderHint}
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
