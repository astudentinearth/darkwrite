import { getAllNotes, Note } from "@renderer/lib/note";
import React, { Dispatch, SetStateAction } from "react";
import {create} from "zustand"

/*export interface NotesContextType{
    notes: Note[],
    setNotes: Dispatch<SetStateAction<Note[]>>,
}

export const NotesContext = React.createContext<NotesContextType>({notes: [], setNotes: ()=>{}});*/

type NotesStore = {
    notes: Note[]
}

type NoteActions = {
    setNotes: (notes: Note[])=>void,
    fetch: ()=>Promise<void>
}

export const useNotesStore = create<NotesStore & NoteActions>((set, get)=>({
    notes: [],
    setNotes: (val)=>set(()=>({notes: val})),
    fetch: async ()=>{
        const notes = await getAllNotes();
        set(()=>({notes}))
    }
}))