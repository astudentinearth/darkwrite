import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@renderer/components/ui/collapsible";
import { cn } from "@renderer/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getFavorites, useNotesStore } from "@renderer/context/notes-context";
import { FavoriteItem } from "./favorite-item";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Note } from "@common/note";
import { produce } from "immer";

export function FavortiesWidget(){
    const notes = useNotesStore((state)=>state.notes);
    const updateMany = useNotesStore((state)=>state.updateMany);
    const [open, setOpen] = useState(true);
    const [target, setTarget] = useState<Note[]>([]);

    useEffect(()=>{
        const favorites = notes.filter((n)=>n.isFavorite && !n.isTrashed);
        if(favorites==null) return;
        for(let i = 0; i < favorites.length; i++){
            if(favorites[i].favoriteIndex == null ) { favorites[i].favoriteIndex == favorites.length }
        }
        favorites.sort((a, b) => (a.favoriteIndex ?? 0) - (b.favoriteIndex ?? 0));
        setTarget(favorites);
    },[notes])

    const render = ()=>{
        const elements: JSX.Element[] = [];
        const arr = [...target];
        arr.sort((a, b) => (a.favoriteIndex ?? 0) - (b.favoriteIndex ?? 0));
        if(arr.length === 0) return elements;
        for(let i = 0; i < arr.length; i++){
            elements.push(<FavoriteItem note={arr[i]} key={arr[i].id} index={i}></FavoriteItem>)
        }
        return elements;
    }

    const dragEnd = async (result: DropResult)=>{
        const {destination, source } = result;
        if(!destination) return;
        if(destination.droppableId === source.droppableId && destination.index === source.index) return;
        const updated = produce(target, draft=>{
            const [removed] = draft.splice(source.index,1);
            draft.splice(destination.index, 0, removed);
            for(let i = 0; i < draft.length; i++){
                draft[i].favoriteIndex = i;
            }
            draft.sort((a,b)=>(a.favoriteIndex ?? 0) - (b.favoriteIndex ?? 0));
        })
        console.log(updated);
        await updateMany(updated);
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