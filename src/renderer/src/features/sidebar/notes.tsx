import { NoteMetada } from "@common/note";
import { Button } from "@renderer/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@renderer/components/ui/collapsible";
import { useNotesStore } from "@renderer/context/notes-context";
import { getAllNotes, Note } from "@renderer/lib/note";
import { cn } from "@renderer/lib/utils";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { DragEvent, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as emoji from "node-emoji"
import { useEditorState } from "@renderer/context/editor-state";

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

function NoteItem(props: {note: NoteMetada}){
    const {note} = props;
    const activePage = useEditorState((state)=>state.page) // used to reflect changes live instead of a full re-fetch
    const forceSave = useEditorState((state)=>state.forceSave);
    const notes = useNotesStore((state)=>state.notes);
    const fetchNotes = useNotesStore((state)=>state.fetch);
    const [subnotes, setSubnotes] = useState([] as Note[]);
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const location = useLocation();
    const [dragOver, setDragOver] = useState(false);

    useEffect(()=>{
        const sub = notes.filter((n)=>note.subnotes?.includes(n.id));
        setSubnotes(sub);
    }, [notes, note.subnotes])

    const render = useCallback(()=>{
        return subnotes.length == 0 ? <span className="text-sm text-foreground/50 px-2">No pages</span> : subnotes.map((n)=><NoteItem note={n}></NoteItem>)
    }, [subnotes])

    useEffect(()=>{
        const id = params.get("id");
        const path = location.pathname;
        if(path!=="/page") setActive(false);
        else if(id!=null && id === note.id) setActive(true);
        else setActive(false);
    }, [params, location, note.id])

    const handleDragStart = (event: DragEvent<HTMLElement>)=>{
        event.dataTransfer.setData("text/plain", note.id)
        event.dataTransfer.effectAllowed="move";
    }

    const handleDrop = (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        if(data === note.id){setDragOver(false); return;}
        else {
            window.api.note.move(data, note.id).then(()=>{fetchNotes()})
            setDragOver(false);
        }
    }

    const handleDragOver = (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        setDragOver(note.id!==data);
    }

    const handleDragLeave = ()=>{setDragOver(false)};
    const handleDragEnd = ()=>{setDragOver(false)};

    return <Collapsible open={open} onOpenChange={setOpen}>
        <div draggable onDragStart={handleDragStart} onDrop={handleDrop} onDragEnd={handleDragEnd} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onClick={()=>{forceSave();navigate({pathname: "/page", search: `?id=${note.id}`})}} 
        className={cn("rounded-[8px] mb-0.5 note-item hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[20px_24px_1fr] hover:grid-cols-[20px_24px_1fr_24px] select-none p-1 h-8 overflow-hidden", 
                    active ? "text-foreground bg-secondary/80" : "text-foreground/60", 
                    dragOver && " outline-dashed outline-border outline-1")}>
            <CollapsibleTrigger onClick={(e)=>{e.stopPropagation()}}>
                <div className="w-5 h-5 hover:bg-secondary/50 rounded-[4px] justify-center items-center flex">
                    {open ? <ChevronDown size={14}></ChevronDown> : <ChevronRight size={14}></ChevronRight>}
                </div>
            </CollapsibleTrigger>
            <span className="inline-block w-6 h-6">{emoji.emojify(active ? activePage.icon : note.icon, {fallback: "📄"})}</span>
            <span className={cn("text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center")}>{active ? activePage.title : note.title}</span>
            <Button size="icon24" className="justify-self-end btn-add" variant={"ghost"} onClick={(e)=>{
                e.stopPropagation();
                Note.create(note.id).then(()=>setOpen(true));
            }}>
                {<Plus size={18}></Plus>}
            </Button>
        </div>
        <CollapsibleContent className="pl-2 flex flex-col">
            {render()}
        </CollapsibleContent>
    </Collapsible>
}