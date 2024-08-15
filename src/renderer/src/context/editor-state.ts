import { Note } from "@common/note"
import { updateNote } from "@renderer/lib/api/note"
import { create } from "zustand"
import { useNotesStore } from "./notes-context"

type editorState = {
    page: Note,
    id: string
}

type editorStateAction = {
    setPage: (n: Note) => void,
    forceSave: ()=>void,
    setID: (id:string)=>void
}

export const useEditorState = create<editorState & editorStateAction>((set, get)=>({
    page: {} as Note,
    setPage: (n: Note)=>set({page: n}),
    id: "",
    setID(id) {
        set({id})
    },
    forceSave: ()=>{
        if(get().id === "") return;
        const note = useNotesStore.getState().getOne(get().id);
        if(note) useNotesStore.getState().update(note);
    }
}))