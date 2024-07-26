import { getAllNotes, Note } from "@renderer/lib/note";
import {create} from "zustand"

type NotesStore = {
    notes: Note[]
}

type NoteActions = {
    setNotes: (notes: Note[])=>void,
    fetch: ()=>Promise<void>
}

export const useNotesStore = create<NotesStore & NoteActions>((set)=>({
    notes: [],
    setNotes: (val)=>set(()=>({notes: val})),
    fetch: async ()=>{
        const notes = await getAllNotes();
        set(()=>({notes}))
    }
}))