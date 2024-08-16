import { Note } from "@common/note";
import { Draggable } from "@hello-pangea/dnd";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@renderer/components/ui/context-menu";
import { useEditorState } from "@renderer/context/editor-state";
import { useNotesStore } from "@renderer/context/notes-context";
import { moveToTrash, updateNote } from "@renderer/lib/api/note";
import { cn } from "@renderer/lib/utils";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { ArrowRightFromLine, Star, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function FavoriteItem({note, index}: {note: Note, index: number}){
    const [active, setActive] = useState(false);
    const forceSave = useEditorState((state)=>state.forceSave);
    const navigate = useNavigate();
    const update = useNotesStore((state)=>state.update);
    const trash = useNotesStore((state)=>state.moveToTrash);
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
                        <div className="flex w-6 h-6 items-center justify-center [&>span]:block [&>span]:leading-[18px] translate-x-[-15%]"><Emoji size={18} emojiStyle={EmojiStyle.NATIVE} unified={note.icon}></Emoji></div>
                        <span className={cn("text-ellipsis whitespace-nowrap block overflow-hidden text-sm self-center pl-1")}>{note.title}</span>
                    </div>
                }  
            </Draggable>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64 rounded-lg">
            <ContextMenuItem onClick={()=>{update({id: note.id, isFavorite: !note.isFavorite, favoriteIndex: 0})}}><Star className={cn(note.isFavorite ? "text-yellow-300 fill-yellow-300" : "opacity-75")} size={20}></Star>&nbsp; {note.isFavorite ? "Remove from favorites" : "Add to favorites"}</ContextMenuItem>
            <ContextMenuSeparator></ContextMenuSeparator>
            <ContextMenuItem disabled><ArrowRightFromLine className="opacity-75" size={20}></ArrowRightFromLine>&nbsp; Export</ContextMenuItem>
            <ContextMenuItem onClick={()=>{trash(note.id)}} className="text-destructive focus:bg-destructive/50 focus:text-destructive-foreground"><Trash className="opacity-75" size={20}></Trash>&nbsp; Move to trash</ContextMenuItem>
            <ContextMenuSeparator></ContextMenuSeparator>
            <span className="text-foreground/50 text-sm p-2">Last edited: {note.modified.toLocaleString()}</span>
        </ContextMenuContent>
    </ContextMenu>
}