import { Note } from "@common/note";
import { Button } from "@renderer/components/ui/button";
import { useEditorState } from "@renderer/context/editor-state";
import { useNotesStore } from "@renderer/context/notes-context";
import { cn } from "@renderer/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export function FavoriteActionButton(){
    const id = useEditorState((state)=>state.id);
    const notes = useNotesStore((state)=>state.notes);
    const update = useNotesStore((state)=>state.update);
    const [targetNote, setTargetNote] = useState<Note|undefined>(undefined)

    useEffect(()=>{
        setTargetNote(notes.find((n)=>n.id===id))
    }, [notes, id])

    return <Button onClick={()=>update({id, isFavorite: !targetNote?.isFavorite})} className={cn("rounded-xl p-0 size-8")} variant={"ghost"}>
        <Star size={20} className={cn(targetNote?.isFavorite && "text-yellow-300 fill-yellow-300")}/>
    </Button>
}