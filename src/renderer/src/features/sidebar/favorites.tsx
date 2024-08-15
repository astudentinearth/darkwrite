import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@renderer/components/ui/collapsible";
import { cn } from "@renderer/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNotesStore } from "@renderer/context/notes-context";
import { FavoriteItem } from "./favorite-item";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Note } from "@common/note";

export function FavortiesWidget(){
    const notes = useNotesStore((state)=>state.notes);
    const fetchNotes = useNotesStore((state)=>state.fetch);
    const [open, setOpen] = useState(true);
    const [target, setTarget] = useState<Note[]>([]);

    useEffect(()=>{
        const favorites = notes?.filter((n)=>(!n.isTrashed && n.isFavorite));
        for(let i = 0; i < favorites.length; i++){
            if(favorites[i].favoriteIndex == null ) { favorites[i].favoriteIndex == favorites.length }
        }   
        setTarget(favorites);
    },[notes])

    const render = useCallback(()=>{
        const elements: JSX.Element[] = [];
        target.sort((a, b) => (a.favoriteIndex ?? 0) - (b.favoriteIndex ?? 0));
        if(target.length === 0) return elements;
        for(let i = 0; i < target.length; i++){
            elements.push(<FavoriteItem note={target[i]} key={target[i].id} index={i}></FavoriteItem>)
        }
        return elements;
    }, [target])

    const dragEnd = async (result: DropResult)=>{
        const {destination, source } = result;
        if(!destination) return;
        if(destination.droppableId === source.droppableId && destination.index === source.index) return;
        const newState = Array.from(target);
        const [removed] = newState.splice(source.index,1);
        newState.splice(destination.index, 0, removed);
        for(let i = 0; i < newState.length; i++){
            newState[i].favoriteIndex = i;
        }
        await window.api.note.saveAll(newState);
        setTarget(newState);
        await fetchNotes();
    }

    return <div className={cn("bg-card/75 rounded-[12px] p-1")}>
    <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
            <div className="flex items-center select-none text-foreground/50 hover:text-foreground transition-colors text-sm p-1">
                {open ? <ChevronDown size={14}></ChevronDown> : <ChevronRight size={14}></ChevronRight>}
                <span>Favorites</span>
            </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <DragDropContext onDragEnd={dragEnd}>
                <Droppable droppableId="#favorites_droppable">
                    {(provided)=>
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {render()}
                        {provided.placeholder}
                    </div>}
                </Droppable>
            </DragDropContext>
        </CollapsibleContent>
    </Collapsible>
</div>
}