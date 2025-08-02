import { NoteDTO } from "@/common/dto";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, getNoteIcon } from "@/lib/utils";
import { useNotes } from "@/query/use-notes";
import { ChevronRight, Plus } from "lucide-react";
import { MouseEvent, useMemo, useState } from "react";
import NoteList from "./note-list";
import { LexoRank } from "lexorank";

export default function NoteItem({ note }: { note: NoteDTO }) {
  const [open, setOpen] = useState(false);
  const { notes } = useNotes();

  const children =
    useMemo(
      () => notes?.filter((n) => n.parentId === note.id),
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

  const handleCollapsibleTrigger = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!open);
  };

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        <div className="grid grid-cols-[24px_1fr_24px] gap-1.5 p-1 overflow-hidden group text-ellipsis whitespace-nowrap hover:bg-secondary/20 rounded-[8px]">
          <Button
            variant={"ghost"}
            onClick={handleCollapsibleTrigger}
            className="p-0 w-6 h-6 rounded-sm  hover:bg-secondary/40"
          >
            <span className="group-hover:hidden">{getNoteIcon(note.icon)}</span>
            <ChevronRight
              size={18}
              className={cn(
                "hidden group-hover:block transition-transform duration-100",
                open && "rotate-90",
              )}
            />
          </Button>
          {note.title}
          <Button
            variant={"ghost"}
            onClick={handleCollapsibleTrigger}
            className="p-0 w-6 h-6 rounded-sm hover:bg-secondary/40"
          >
            <Plus
              size={18}
              className={cn(
                "hidden group-hover:block",
              )}
            />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-3">
        <NoteList
          notes={children}
          leadingOrderHint={computeLeadingHint()}
          finalOrderHint={computeFinalHint()}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
