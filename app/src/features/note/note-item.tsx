import { NoteDTO } from "@/common/dto";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getNoteIcon } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MouseEvent, useState } from "react";

export default function NoteItem({note}: {note: NoteDTO}) {
  const [open, setOpen] = useState(false);

  const handleCollapsibleTrigger = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!open);
  }

  return <Collapsible open={open}>
    <CollapsibleTrigger asChild>
      <div className="grid grid-cols-[32px_auto] p-1 overflow-hidden group text-ellipsis whitespace-nowrap hover:bg-secondary/20 rounded-[8px]">
        <Button variant={"ghost"} onClick={handleCollapsibleTrigger} className="p-0 w-6 h-6 rounded-sm  hover:bg-secondary/40">
          <span className="group-hover:hidden">{getNoteIcon(note.icon)}</span>
          {open ? <ChevronDown size={18} className="hidden group-hover:block"/> : <ChevronRight size={18} className="hidden group-hover:block"/>}
        </Button>
        {note.orderHint}
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      
    </CollapsibleContent>
  </Collapsible>
}