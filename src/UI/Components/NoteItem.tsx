import { MouseEvent } from "react";
import { NoteHeader } from "../../Util";
import { ShowNoteContextMenu } from "./NoteContextMenu";
interface NoteProps{
    header: NoteHeader,
}

export function NoteItem(props:NoteProps){
    const {foreground, background, font} = props.header.formatting;
    /* const {attributes, listeners, 
        setNodeRef, transform, transition} = useSortable({
            id: props.header.id, 
            disabled: !props.header.pinned}) */
    const handleContextMenu = (event: MouseEvent<HTMLDivElement>)=>{
        event.preventDefault();
        console.log(event.clientX);
        ShowNoteContextMenu({posX: event.clientX, posY: event.clientY, targetNote: props.header});
    }

    return <div onContextMenu={handleContextMenu} className="p-2 flex overflow-auto shrink justify-between w-[16rem] rounded-lg note-shadow select-none cursor-default" style={{background: background ?? "#ffffff",
    color: foreground ?? "#000000",
    fontFamily: font ?? "Roboto"}}>
        <span>{props.header.title}</span>
    </div>
}