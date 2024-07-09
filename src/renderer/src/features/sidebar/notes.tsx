import { NoteMetada } from "@common/note";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@renderer/components/ui/collapsible";
import { getAllNotes, Note } from "@renderer/lib/note";
import { cn } from "@renderer/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function NotesWidget(){
    const [notes, setNotes] = useState<Note[]>();
    const [open, setOpen] = useState(true);
    useEffect(()=>{
        (async()=>{
            const n = await getAllNotes();
            if(n!=null) setNotes(n);
            else throw new Error("Could not load notes");
        })();
    })

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
    const [subnotes, setSubnotes] = useState([] as Note[]);
    const [open, setOpen] = useState(false);

    // TEMPORARY SEARCH CODE BEFORE CONTEXT IMPLEMENTATION
    const getChildren = async ()=>{
        const notes = await getAllNotes();
        const sub = notes.filter((n)=>note.subnotes?.includes(n.id));
        setSubnotes(sub);
    }

    const render = useCallback(()=>{
        return subnotes.length == 0 ? <span className="text-sm text-foreground/50 px-2">No pages</span> : subnotes.map((n)=><NoteItem note={n}></NoteItem>)
    }, [subnotes])

    useEffect(()=>{getChildren()}, [])
    return <Collapsible open={open} onOpenChange={setOpen}>
        <div className={cn("rounded-[8px] hover:bg-secondary/50 hover:text-foreground active:bg-secondary/25 transition-colors grid grid-cols-[20px_24px_1fr] select-none p-1 h-8 overflow-hidden", selected ? "text-foreground" : "text-foreground/60", )}>
            <CollapsibleTrigger onClick={(e)=>{e.stopPropagation()}}>
                <div className="w-5 h-5 hover:bg-secondary/50 rounded-[4px] justify-center items-center flex">
                    {open ? <ChevronDown size={14}></ChevronDown> : <ChevronRight size={14}></ChevronRight>}
                </div>
            </CollapsibleTrigger>
            <span className="inline-block w-6 h-6">{note.icon}</span>
            <span className={cn("text-ellipsis whitespace-nowrap block overflow-hidden")}>{note.title}</span>
        </div>
        <CollapsibleContent className="pl-2">
            {render()}
        </CollapsibleContent>
    </Collapsible>
}