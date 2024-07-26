import { useNotesStore } from "@renderer/context/notes-context";
import { cn } from "@renderer/lib/utils";
import { useState, DragEvent } from "react";
export function NoteDropZone({parentID, belowID, last}: {parentID?: string | null, belowID?: string, last?: boolean}){
    const [dragOver, setDragOver] = useState(false);
    const notes = useNotesStore((state)=>state.notes);
    const setNotes = useNotesStore((state)=>state.setNotes);
    const handleDrop = async (event: DragEvent<HTMLElement>)=>{
        event.preventDefault();
        event.stopPropagation();
        const data = event.dataTransfer.getData("text/plain");
        setDragOver(false);

        // we will mutate the list on the client side first
        const arr = [...notes];
        const noteIndex = arr.findIndex((n)=>n.id===data); // find original
        const note = arr[noteIndex];

        // detatch note from its parent
        const parentIndex = arr.findIndex((n)=>n.id===note.parentID);
        if(parentIndex !== -1){
            arr[parentIndex].subnotes = arr[parentIndex].subnotes.filter((n)=>n!==note.id); // get rid of the subnote
        }
        
        // assign new parent
        note.parentID = parentID;

        // add subnote to destination
        if(parentID != null){
            const destIndex = arr.findIndex((n)=>n.id===parentID);
            arr[destIndex].subnotes.push(data);
        }
        const belowIndex = arr.findIndex((n)=>n.id===belowID);// find note below this drop zone
        console.log(`%c Before moving | source ${noteIndex} | below ${belowIndex}`, "color:cyan")

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

        // assign new indexes
        for(let i = 0; i < arr.length; i++){
            arr[i].index = i;
        }

        const newIndex = arr.findIndex((n)=>n.id===data);
        const newBelowIndex = arr.findIndex((n)=>n.id===belowID);

        console.log(`%c After moving | source ${newIndex} | below ${newBelowIndex}`, "color:orange")

        setNotes(arr); // update
        window.api.note.saveAll(arr); // save changes
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