import { NoteMetada } from "@common/note";
import { Button } from "@renderer/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@renderer/components/ui/collapsible";
import { useNotesStore } from "@renderer/context/notes-context";
import { getAllNotes, Note } from "@renderer/lib/note";
import { cn } from "@renderer/lib/utils";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

function NoteItem(props: {note: NoteMetada, selected?: boolean}){
    const {note, selected} = props;
    const notes = useNotesStore((state)=>state.notes);
    const [subnotes, setSubnotes] = useState([] as Note[]);
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        const sub = notes.filter((n)=>note.subnotes?.includes(n.id));
        console.log(note.subnotes);
        setSubnotes(sub);
    }, [notes, note.subnotes])

    const render = useCallback(()=>{
        return subnotes.length == 0 ? <span className="text-sm text-foreground/50 px-2">No pages</span> : subnotes.map((n)=><NoteItem note={n}></NoteItem>)
    }, [subnotes])

    return <Collapsible open={open} onOpenChange={setOpen}>
        <div className={cn("rounded-[8px] note-item hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[20px_24px_1fr] hover:grid-cols-[20px_24px_1fr_24px] select-none p-1 h-8 overflow-hidden", selected ? "text-foreground" : "text-foreground/60", )}>
            <CollapsibleTrigger onClick={(e)=>{e.stopPropagation()}}>
                <div className="w-5 h-5 hover:bg-secondary/50 rounded-[4px] justify-center items-center flex">
                    {open ? <ChevronDown size={14}></ChevronDown> : <ChevronRight size={14}></ChevronRight>}
                </div>
            </CollapsibleTrigger>
            <span className="inline-block w-6 h-6">{note.icon === "" ? "📄" : note.icon}</span>
            <span className={cn("text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center")}>{note.title}</span>
            <Button size="icon24" className="justify-self-end btn-add" variant={"ghost"} onClick={(e)=>{
                e.stopPropagation();
                Note.create(note.id).then(()=>setOpen(true));
            }}>
                {<Plus size={18}></Plus>}
            </Button>
        </div>
        <CollapsibleContent className="pl-2">
            {render()}
        </CollapsibleContent>
    </Collapsible>
}