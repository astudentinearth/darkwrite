import { Note, NoteCustomizations } from "@darkwrite/common"
import { create } from "zustand"
import { useNotesStore } from "./notes-context"
import { type JSONContent } from "novel"
import { updateContents } from "@renderer/lib/api/note"
import { debounce } from "lodash"

type editorState = {
    page: Note,
    id: string,
    content: JSONContent
    customizations: NoteCustomizations
}

type editorStateAction = {
    setPage: (n: Note) => void,
    forceSave: ()=>void,
    setID: (id:string)=>void,
    setContent: (content: JSONContent)=>void,
    setCustomzations: (data: NoteCustomizations)=>void
}

const debouncedSave = debounce((id :string, data: {content: JSONContent, customizations: NoteCustomizations})=>{
    updateContents(id, JSON.stringify(data));
}, 200);

export const useEditorState = create<editorState & editorStateAction>()((set, get)=>({
    page: {} as Note,
    setPage: (n: Note)=>set({page: n}),
    id: "",
    setID(id) {
        set({id})
    },
    forceSave: ()=>{
        if(get().id === "") return;
        const data = {
            content: get().content,
            customizations: get().customizations
        }
        const str = JSON.stringify(data);
        const note = useNotesStore.getState().getOne(get().id);
        if(note) {
            useNotesStore.getState().update(note);
            updateContents(note.id, str);
        }
    },
    content: {},
    setContent(content) {
        set({content})
        debouncedSave(get().id, {content, customizations: get().customizations});
    },
    customizations: {},
    setCustomzations(customizations) {
        set({customizations})
        debouncedSave(get().id, {content: get().content, customizations: customizations});
    },
}))