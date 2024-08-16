import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@renderer/components/ui/collapsible";
import { useNotesStore } from "@renderer/context/notes-context";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, DragEvent} from "react";
import { NoteItem } from "./note-item";
import { cn } from "@renderer/lib/utils";
import { NoteDropZone } from "./note-drop-zone";

export function NotesWidget(){
    const notes = useNotesStore((state)=>state.notes);
    const fetchNotes = useNotesStore((state)=>state.fetch);
    const move = useNotesStore((state)=>state.move);
    const [open, setOpen] = useState(true);
    const [dragOver, setDragOver] = useState(false);
    useEffect(()=>{
        fetchNotes();
    },[fetchNotes])

    const render = useCallback(()=>{
        const target = notes?.filter((n)=>(n.parentID == null && !n.isTrashed));
        if(target==null) return <></>
        const elements: JSX.Element[] = [];
        if(target.length === 0) return elements;
        for(let i = 0; i < target.length; i++){
            elements.push(<NoteDropZone key={i} belowID={target[i].id} parentID={null}></NoteDropZone>)
            elements.push(<NoteItem note={target[i]} key={target[i].id}></NoteItem>)
        }
        elements.push(<NoteDropZone key={"$last"} last parentID={null}></NoteDropZone>);
        return elements;
    }, [notes])

    const handleDrop = (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        console.log("Dropping to top")
        move(data, null);
        setDragOver(false);
    }

    const handleDragOver = (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        setDragOver(true);
    }
    const handleDragLeave = ()=>{setDragOver(false)};
    const handleDragEnd = ()=>{setDragOver(false)};
    return <div className={cn("bg-card/75 rounded-[12px] p-1", dragOver && "bg-card/90")}>
        <Collapsible onDrop={handleDrop} onDragEnd={handleDragEnd} onDragLeave={handleDragLeave} onDragOver={handleDragOver} open={open} onOpenChange={setOpen}>
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

