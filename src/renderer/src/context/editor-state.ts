import { Note } from "@renderer/lib/note"
import { produce } from "immer"
import { create } from "zustand"

type editorState = {
    page: Note
}

type editorStateAction = {
    setPage: (n: Note) => void,
    forceSave: ()=>void
}

export const useEditorState = create<editorState & editorStateAction>((set, get)=>({
    page: Note.empty(),
    setPage: (n: Note)=>set({page: n}),
    forceSave: ()=>{get().page.save()}
}))