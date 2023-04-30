import { MouseEvent } from "react";
import { NoteHeader } from "../../Util";
import { ShowNoteContextMenu } from "./NoteContextMenu";
import { ShowNoteEditor } from "../NoteEditor";
import { GetNoteInfoFromHeader } from "../../backend/Note";
interface NoteProps{
    header: NoteHeader,
}

export function NoteItem(props:NoteProps){
    const {foreground, background, font} = props.header.formatting;
    console.log("%c"+JSON.stringify(props.header.formatting),"color:cyan");
    /* const {attributes, listeners, 
        setNodeRef, transform, transition} = useSortable({
            id: props.header.id, 
            disabled: !props.header.pinned}) */
    const handleContextMenu = (event: MouseEvent<HTMLDivElement>)=>{
        event.preventDefault();
        console.log(event.clientX);
        ShowNoteContextMenu({posX: event.clientX, posY: event.clientY, targetNote: props.header});
    }

    return <div onClick={async ()=>{
        ShowNoteEditor(await GetNoteInfoFromHeader(props.header));
    }} onContextMenu={handleContextMenu} className="p-2 flex overflow-auto shrink justify-between w-[16rem] rounded-lg note-shadow select-none cursor-default" 
    style={{background: background ?? "#ffffff",
    fontFamily: font ?? "Roboto",
    marginTop: "4px"}}>
        <span style={{color: foreground ?? "#000000"}}>{props.header.title}</span>
    </div>
}