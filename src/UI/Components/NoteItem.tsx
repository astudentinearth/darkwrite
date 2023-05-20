import { MouseEvent } from "react";
import { NoteHeader } from "../../Util";
import { ShowNoteContextMenu } from "./NoteContextMenu";
import { ShowNoteEditor } from "../NoteEditor";
import { GetNoteInfoFromHeader } from "../../backend/Note";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import { PinNote, UnpinNote } from "../NotesPanelMethods";
import {ReactComponent as GripSVG} from "../../res/grip.svg"
interface NoteProps{
    header: NoteHeader,
}

export function NoteItem(props:NoteProps){
    const {foreground, background, font} = props.header.formatting;
     const {attributes, listeners, 
        setNodeRef, transform, transition} = useSortable({
            id: props.header.id, 
            disabled: !props.header.pinned})

    
    const handleContextMenu = (event: MouseEvent<HTMLDivElement>)=>{
        event.preventDefault();
        ShowNoteContextMenu({posX: event.clientX, posY: event.clientY, targetNote: props.header});
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return <div onClick={async ()=>{
        ShowNoteEditor(await GetNoteInfoFromHeader(props.header));
    }} onContextMenu={handleContextMenu} className="p-2 m-1 flex note-root ignore-drag overflow-clip text-ellipsis shrink rounded-lg note-shadow items-center select-none cursor-default" 
    style={{background: background ?? "#ffffff",
    fontFamily: font ?? "Roboto",
    marginTop: "4px", ...(props.header.pinned ? style : {})}} ref={props.header.pinned ? setNodeRef : null} {...attributes} {...listeners}>
        {props.header.pinned ? <GripSVG style={{fill: props.header.formatting.foreground}} className="mr-1 ml-[-0.25rem] w-[16px] h-[24px] outline-2 outline-transparent hover:brightness-150"></GripSVG> : <></>}
        <div onClick={(event)=>{
            event?.stopPropagation();
            if(props.header.pinned == false) PinNote(props.header);
            else UnpinNote(props.header);
        }} className="note-pin-button ignore-drag mr-2 ignore-drag hover:bg-secondary/20 cursor-pointer rounded-md p-1 w-6 h-6 flex items-center justify-center"><i style={{color: props.header.formatting.foreground}} className={`${!props.header.pinned ? "bi-pin-angle" : "bi-pin-angle-fill"} ignore-drag`}></i></div>
        <span className="inline-block whitespace-nowrap text-ellipsis ignore-drag"  style={{color: foreground ?? "#000000"}}>{props.header.title}</span>
    </div>
}