import { NoteDTO } from "@/common/dto";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { NoteContextMenuContainer } from "./note-context-menu";
import NoteHeader from "./note-header";
import { NoteList2 } from "./note-list-2";
import { useOrderHints } from "./note-store";

export default function NoteItem({ note }: { note: NoteDTO }) {
  const [open, setOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const { finalHint } = useOrderHints(note.id);

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        <NoteContextMenuContainer
          note={note}
          onOpenChange={setContextMenuOpen}
          finalOrderHint={finalHint}
        >
          <NoteHeader
            finalOrderHint={finalHint}
            collapsible
            showCreate
            open={open}
            setOpen={setOpen}
            note={note}
            contextMenuOpen={contextMenuOpen}
            className="opacity-70 hover:opacity-100"
          />
        </NoteContextMenuContainer>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-3">
        <NoteList2 parentId={note.id} className="select-none" />
      </CollapsibleContent>
    </Collapsible>
  );
}
