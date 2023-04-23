import { NoteHeader } from "../../Util";
import React, { useRef, MouseEvent} from "react";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
interface NoteProps{
    header: NoteHeader,
}

const MENU_ID = "noteContext";

export function NoteItem(props:NoteProps){
    let {foreground, background, font} = props.header.formatting;
    /* const {attributes, listeners, 
        setNodeRef, transform, transition} = useSortable({
            id: props.header.id, 
            disabled: !props.header.pinned}) */
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const handleContextMenu = (event: MouseEvent<HTMLDivElement>)=>{
        event.preventDefault();
        if(contextMenuRef==null) return;
        if(contextMenuRef.current==null) return;
        let bounds = (event.target as HTMLElement).getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        contextMenuRef.current.style.setProperty("left", `${x}px`);
        contextMenuRef.current.style.setProperty("top", `${y}px`);
    }

    return <div onContextMenu={handleContextMenu} className="p-2 flex shrink relative justify-between w-[16rem] rounded-lg note-shadow select-none cursor-default" style={{background: background ?? "#ffffff",
    color: foreground ?? "#000000",
    fontFamily: font ?? "Roboto"}}>
        <span>{props.header.title}</span>
        <div>
            <div ref={contextMenuRef} className="p-1 w-64 bg-gray-500 z-30 absolute left-0">esıuygh</div>
        </div>
    </div>
}