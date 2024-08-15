import { Note } from "@common/note";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@renderer/components/ui/collapsible";
import { Button } from "@renderer/components/ui/button";
import { useEditorState } from "@renderer/context/editor-state";
import { useNotesStore } from "@renderer/context/notes-context";

import { cn } from "@renderer/lib/utils";
import { ArrowRightFromLine, ChevronDown, ChevronRight, Copy, FilePlus2, Forward, Plus, Star, Trash } from "lucide-react";
import { useState, useEffect, useCallback, DragEvent } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { emojify } from "node-emoji";
import { NoteDropZone } from "./note-drop-zone";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@renderer/components/ui/context-menu";
import { Emoji, EmojiStyle } from "emoji-picker-react";

export function NoteItem({note, noDrop, noDrag}: {note: Note, noDrop?: boolean, noDrag?:boolean}){
    const activePage = useEditorState((state)=>state.page) // used to reflect changes live instead of a full re-fetch
    const forceSave = useEditorState((state)=>state.forceSave);
    const notes = useNotesStore((state)=>state.notes);
    const fetchNotes = useNotesStore((state)=>state.fetch);
    
    const [subnotes, setSubnotes] = useState([] as Note[]);
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const location = useLocation();
    

    useEffect(()=>{
        const sub = notes.filter((n)=>note.subnotes?.includes(n.id));
        setSubnotes(sub);
    }, [notes, note.subnotes])

    const render = useCallback(()=>{
        const target = [...subnotes];
        target.filter((n)=>!n.isTrashed);
        const elements: JSX.Element[] = [];
        if(target.length === 0) return <span className="text-sm text-foreground/50 px-2">No pages</span>;
        for(let i = 0; i < target.length; i++){
            elements.push(<NoteDropZone key={i} belowID={target[i].id} parentID={note.id}></NoteDropZone>)
            elements.push(<NoteItem noDrop={noDrop} noDrag={noDrag} note={target[i]} key={target[i].id}></NoteItem>)
        }
        elements.push(<NoteDropZone last parentID={note.id} key={"$"}></NoteDropZone>);
        return elements;
    }, [subnotes])

    useEffect(()=>{
        const id = params.get("id");
        const path = location.pathname;
        if(path!=="/page") setActive(false);
        else if(id!=null && id === note.id) setActive(true);
        else setActive(false);
    }, [params, location, note.id])

    const handleDragStart = (event: DragEvent<HTMLElement>)=>{
        event.stopPropagation();
        event.dataTransfer.setData("text/plain", note.id)
        event.dataTransfer.effectAllowed="move";
    }

    const handleDrop = (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        event.stopPropagation();
        console.log("Dropping to item")
        const data = event.dataTransfer.getData("text/plain");
        if(data === note.id){setDragOver(false); return;}
        else {
            window.api.note.move(data, note.id).then(()=>{fetchNotes()})
            setDragOver(false);
        }
    }

    const handleDragOver = (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        event.stopPropagation();
        const data = event.dataTransfer.getData("text/plain");
        setDragOver(note.id!==data);
    }

    const handleDragLeave = ()=>{setDragOver(false)};
    const handleDragEnd = ()=>{setDragOver(false)};

    return <ContextMenu>
        <ContextMenuTrigger>
            <Collapsible open={open} onOpenChange={setOpen}>
            <div draggable onDragStart={noDrag ? ()=>{} : handleDragStart} onDrop={noDrop ? ()=>{} :  handleDrop} onDragEnd={noDrag ? ()=>{} : handleDragEnd} onDragLeave={noDrag ? ()=>{} : handleDragLeave} onDragOver={noDrag ? ()=>{} : handleDragOver} onClick={()=>{forceSave();navigate({pathname: "/page", search: `?id=${note.id}`})}} 
            className={cn("rounded-[8px] note-item hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[20px_24px_1fr] hover:grid-cols-[20px_24px_1fr_24px] select-none p-1 h-8 overflow-hidden", 
                        active ? "text-foreground bg-secondary/80" : "text-foreground/60", 
                        dragOver && " outline-dashed outline-border outline-1")}>
                <CollapsibleTrigger onClick={(e)=>{e.stopPropagation()}}>
                    <div className="w-5 h-5 hover:bg-secondary/50 rounded-[4px] justify-center items-center flex">
                        {open ? <ChevronDown size={14}></ChevronDown> : <ChevronRight size={14}></ChevronRight>}
                    </div>
                </CollapsibleTrigger>
                <div className="flex w-6 h-6 items-center justify-center [&>span]:block [&>span]:leading-[18px] translate-x-[-15%]"><Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified={(active ? activePage.icon : note.icon)}></Emoji></div>
                <span className={cn("text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center pl-1")}>{active ? activePage.title : note.title}</span>
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
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64 rounded-lg">
            <ContextMenuItem onClick={()=>{const n = Note.from(note); n.isFavorite = !n.isFavorite; n.favoriteIndex=0;n.save()}}><Star className={cn(note.isFavorite ? "text-yellow-300 fill-yellow-300" : "opacity-75")} size={20}></Star>&nbsp; {note.isFavorite ? "Remove from favorites" : "Add to favorites"}</ContextMenuItem>
            <ContextMenuSeparator></ContextMenuSeparator>
            <ContextMenuItem onClick={()=>{Note.create(note.id)}}><FilePlus2  className="opacity-75" size={20}></FilePlus2> &nbsp; New subpage</ContextMenuItem>
            <ContextMenuItem disabled><Forward className="opacity-75" size={20}></Forward>&nbsp; Move to</ContextMenuItem>
            <ContextMenuItem disabled><Copy className="opacity-75" size={20}></Copy>&nbsp; Duplicate</ContextMenuItem>
            <ContextMenuItem disabled><ArrowRightFromLine className="opacity-75" size={20}></ArrowRightFromLine>&nbsp; Export</ContextMenuItem>
            <ContextMenuSeparator></ContextMenuSeparator>
            <ContextMenuItem onClick={()=>{Note.from(note).trash()}} className="text-destructive focus:bg-destructive/50 focus:text-destructive-foreground"><Trash className="opacity-75" size={20}></Trash>&nbsp; Move to trash</ContextMenuItem>
            <ContextMenuSeparator></ContextMenuSeparator>
            <span className="text-foreground/50 text-sm p-2">Last edited: {note.modified.toLocaleString()}</span>
        </ContextMenuContent>
    </ContextMenu>
}