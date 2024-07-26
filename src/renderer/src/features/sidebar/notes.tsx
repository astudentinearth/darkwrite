import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@renderer/components/ui/collapsible";
import { useNotesStore } from "@renderer/context/notes-context";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NoteItem } from "./note-item";

export function NotesWidget(){
    const notes = useNotesStore((state)=>state.notes);
    const fetchNotes = useNotesStore((state)=>state.fetch);
    const [open, setOpen] = useState(true);
    useEffect(()=>{
        fetchNotes();
    },[fetchNotes])

    const render = useCallback(()=>{
        return notes?.filter((n)=>!n.hasParent()).map((n, i)=><NoteItem note={n} key={i}></NoteItem>)
    }, [notes])

    return <div className="bg-card/75 rounded-[12px] p-1">
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <div className="flex items-center select-none text-foreground/50 hover:text-foreground transition-colors text-sm p-1">
                    {open ? <ChevronDown size={14}></ChevronDown> : <ChevronRight size={14}></ChevronRight>}
                    <span>All notes</span>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                {render()}
            </CollapsibleContent>
        </Collapsible>
    </div>
}

