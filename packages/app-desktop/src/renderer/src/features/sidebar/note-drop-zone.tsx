import { useNotesStore } from "@renderer/context/notes-context";
import { cn } from "@renderer/lib/utils";
import { produce } from "immer";
import { useState, DragEvent } from "react";
export function NoteDropZone({parentID, belowID, last}: {parentID?: string | null, belowID?: string, last?: boolean}){
    const [dragOver, setDragOver] = useState(false);
    const notes = useNotesStore((state)=>state.notes);
    const setNotes = useNotesStore((state)=>state.updateAll);
    const handleDrop = async (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        event.stopPropagation();
        const data = event.dataTransfer.getData("note_id");
        setDragOver(false);
        // we will mutate the list on the client side first
        const updated = produce(notes, arr=>{
            const belowIndex = arr.findIndex((n)=>n.id===belowID);// find note below this drop zone
            const noteIndex = arr.findIndex((n)=>n.id===data); // find original
            const note = arr[noteIndex];
            note.parentID = parentID;
            // move notes around
            if(last){
                arr.splice(noteIndex, 1); // remove original
                arr.push(note); // send to the end
            } else {
                if(belowIndex > noteIndex){
                    // account for the removed item
                    arr.splice(belowIndex-1, 0, arr.splice(noteIndex, 1)[0])// move original just before below
                }
                else {
                    arr.splice(belowIndex, 0, arr.splice(noteIndex, 1)[0])// move original just before below
                }
            }
            // reindex
            for(let i=0; i< arr.length; i++){
                arr[i].index = i;
            }
        })
        setNotes(updated); // update
    }

    const handleDragOver = (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        event.stopPropagation();
        const below = notes.find((n)=>n.id===belowID)
        console.log(below?.title);
        setDragOver(true);
    }

    const handleDragLeave = ()=>{setDragOver(false)};
    const handleDragEnd = ()=>{setDragOver(false)};
    return <div className={cn("h-[3px] w-full bg-transparent transition-colors rounded-md", dragOver && "bg-primary")} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragLeave={handleDragLeave} onDrop={handleDrop}></div>
}