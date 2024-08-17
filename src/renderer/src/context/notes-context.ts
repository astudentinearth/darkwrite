import { Note } from "@common/note"
import { createNote, deleteNote, getNotes, saveAll, updateNote } from "@renderer/lib/api/note"
import { produce } from "immer"
import {create} from "zustand"
import {debounce} from "lodash"

type NotesStore = {
    notes: Note[]
}

type NoteActions = {
    setNotes: (notes: Note[])=>void,
    fetch: ()=>Promise<void>,
    updateIndexes: () => Promise<void>,
    moveToTrash: (id: string)=>Promise<void>
    move: (src: string, dest: string|null)=>Promise<void>,
    update: (data: Partial<Note>)=>Promise<void>,
    restoreFromTrash: (id: string)=>Promise<void>,
    getOne: (id: string)=>(Note | undefined),
    debouncedUpdate: (data: Partial<Note>)=>void,
    updateMany: (data: Partial<Note>[])=>Promise<void>,
    updateAll: (notes: Note[])=>Promise<void>,
    delete: (id: string)=>Promise<void>
    /*
    findSubnotes: (id: string)=>Note[],
    
    */
}

export const debouncedSave = debounce((data: Partial<Note>)=>{
    if(data.id != null && data.id !== "") updateNote(data);
}, 200);

export const useNotesStore = create<NotesStore & NoteActions>()((set, get)=>({
    notes: [],
    setNotes: (val)=>set(()=>({notes: val})),

    fetch: async ()=>{
        const notes = await getNotes();
        set(()=>({notes}))
    },

    async updateIndexes() {
        const updated = produce(get().notes, draft=>{
            for(let i=0; i< draft.length; i++){
                draft[i].index = i;
            }
        })
        set({notes: updated});
        await saveAll(updated);
    },

    async moveToTrash(id: string) {
        const i = get().notes.findIndex((x)=>x.id===id);
        if(i==-1) return;
        const updated = produce(get().notes, draft => {
            draft[i].isTrashed = true;
        })
        set({notes: updated});
        await updateNote(updated[i]);
    },

    async move(src, dest) {
        const sourceIndex = get().notes.findIndex((n)=>n.id===src);
        const updated = produce(get().notes, draft => {
            if(sourceIndex != -1){
                draft[sourceIndex].parentID = dest;
            }
        })
        set({notes: updated});
        await updateNote(updated[sourceIndex]);
    },

    async update(data) {
        if(data.id == null) return;
        const i = get().notes.findIndex(n => n.id === data.id);
        const updated = produce(get().notes, draft =>{
            if(i!=-1){
                draft[i] = {...draft[i], ...data};
            }
        })
        set({notes: updated});
        await updateNote(updated[i]);
    },

    async updateMany(data) {
        const updated = produce(get().notes, draft=>{
            for(const n of data){
                if(n.id==null) continue;
                const i = draft.findIndex((x)=>x.id===n.id);
                if(i==-1) continue;
                draft[i] = {...draft[i], ...n}
            }
        })
        set({notes: updated});
        await saveAll(updated);
    },

    async delete(id: string){
        const updated = produce(get().notes, draft => {
            const i = draft.findIndex((n)=>n.id===id);
            if(i==-1) return;
            draft.splice(i, 1);
        });
        if(updated.length === get().notes.length) return; // we didnt delete ??
        set({notes: updated});
        deleteNote(id);
    },

    async restoreFromTrash(id) {
        const index = get().notes.findIndex(n=>n.id===id);
        if(index==-1) return;
        const updated = produce(get().notes, draft =>{
            draft[index].isTrashed = false;
        })
        set({notes: updated});
        await updateNote(updated[index]);
    },

    debouncedUpdate(data) {
        if(data.id == null) return;
        const i = get().notes.findIndex(n => n.id === data.id);
        const updated = produce(get().notes, draft =>{
            if(i!=-1){
                draft[i] = {...draft[i], ...data};
            }
        })
        set({notes: updated});
        debouncedSave(updated[i]);
    },

    getOne(id) {
        return get().notes.find(n=>n.id===id);
    },

    async updateAll(notes) {
        set({notes});
        await saveAll(notes);
    },
}))

export function getFavorites(){
    return useNotesStore.getState().notes.filter((n)=>n.isFavorite);
}

export async function createNewNote(parentID?: string){
    const note = await createNote("Untitled", parentID); // new note returned from backend
    if(note == null) return;
    const updated = produce(useNotesStore.getState().notes, draft => {
        note.index = draft.length; // assign an index immediately
        draft.push(note);
    })
    useNotesStore.setState({notes: updated}); // push it without a full reload
    await updateNote(note); // save the new index
    return note; // return it so we can naviagate if desired
}

export function findSubnotes(parentID: string){
    const subnotes = useNotesStore.getState().notes.filter((n)=>n.parentID===parentID);
    return subnotes;
}

