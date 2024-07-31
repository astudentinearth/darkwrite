import { NoteMetada } from "@common/note";
import { Draggable } from "@hello-pangea/dnd";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@renderer/components/ui/context-menu";
import { useEditorState } from "@renderer/context/editor-state";
import { Note } from "@renderer/lib/note";
import { cn } from "@renderer/lib/utils";
import { ArrowRightFromLine, Star, Trash } from "lucide-react";
import { emojify } from "node-emoji";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function FavoriteItem({note, index}: {note: NoteMetada, index: number}){
    const activePage = useEditorState((state)=>state.page) // used to reflect changes live instead of a full re-fetch
    const [active, setActive] = useState(false);
    const forceSave = useEditorState((state)=>state.forceSave);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const location = useLocation();
    useEffect(()=>{
            const id = params.get("id");
            const path = location.pathname;
            if(path!=="/page") setActive(false);
            else if(id!=null && id === note.id) setActive(true);
            else setActive(false);
    }, [params, location, note.id])

    return <ContextMenu>
        <ContextMenuTrigger>
            <Draggable draggableId={note.id} index={index}>
                {(provided)=>
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} onClick={()=>{forceSave();navigate({pathname: "/page", search: `?id=${note.id}`})}} 
                        className={cn("rounded-[8px] !cursor-default note-item hover:bg-secondary/50 hover:text-foreground font-medium active:bg-secondary/25 transition-colors grid grid-cols-[20px_24px_1fr] select-none p-1 h-8 overflow-hidden", 
                                    active ? "text-foreground bg-secondary/80" : "text-foreground/60", )}>
                        <div></div>
                        <span className="inline-block w-6 h-6">{emojify(active ? activePage.icon : note.icon, {fallback: "📄"})}</span>
                        <span className={cn("text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center")}>{active ? activePage.title : note.title}</span>
                    </div>
                }  
            </Draggable>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64 rounded-lg">
            <ContextMenuItem onClick={()=>{const n = Note.from(note); n.isFavorite = !n.isFavorite; n.favoriteIndex=0;n.save()}}><Star className={cn(note.isFavorite ? "text-yellow-300 fill-yellow-300" : "opacity-75")} size={20}></Star>&nbsp; {note.isFavorite ? "Remove from favorites" : "Add to favorites"}</ContextMenuItem>
            <ContextMenuSeparator></ContextMenuSeparator>
            <ContextMenuItem disabled><ArrowRightFromLine className="opacity-75" size={20}></ArrowRightFromLine>&nbsp; Export</ContextMenuItem>
            <ContextMenuItem onClick={()=>{Note.from(note).trash()}} className="text-destructive focus:bg-destructive/50 focus:text-destructive-foreground"><Trash className="opacity-75" size={20}></Trash>&nbsp; Move to trash</ContextMenuItem>
            <ContextMenuSeparator></ContextMenuSeparator>
            <span className="text-foreground/50 text-sm p-2">Last edited: {note.modified.toLocaleString()}</span>
        </ContextMenuContent>
    </ContextMenu>
}