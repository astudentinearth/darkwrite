import { Note } from "@common/note"
import { updateNote } from "@renderer/lib/api/note"
import { create } from "zustand"

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
    forceSave: ()=>{console.log("Force saving note",get().page); updateNote(get().page)}
}))