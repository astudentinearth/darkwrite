import { Note } from "@darkwrite/common";
import { attempt } from "lodash";
import { generateHTML } from "@tiptap/html";
import { defaultExtensions } from "@renderer/features/editor/extensions/extensions";
import { useNotesStore } from "@renderer/context/notes-context";

const API = window.api.note; // electron API

export async function createNote(title:string, parent?: string){
    return await API.create(title, parent);
}

export async function updateContents(id: string, content: string){
    API.setContents(id, content);
}

export async function getContents(id: string){
    return await API.getContents(id);
}

export async function deleteNote(id: string){
    await API.delete(id);
}

export async function moveNote(sourceID: string, destinationID: string){
    await API.move(sourceID, destinationID);
}

export async function updateNote(data: Partial<Note>){
    if(!data.id) return;
    await API.update(data);
}


export async function getNotes(){
    return await API.getAll();
}

export async function moveToTrash(id: string){
    await API.setTrashStatus(id, true);
}

export async function restoreFromTrash(id:string){
    await API.setTrashStatus(id, false);
}

export async function getNote(id:string){
    return await API.getNote(id);
}

export async function saveAll(notes: Note[]){
    await API.saveAll(notes);
}

export async function exportHTML(id: string){
    const contentStr = await getContents(id);
    console.log(contentStr);
    const parsed = attempt(()=>JSON.parse(contentStr));
    if(parsed instanceof Error) return;
    if("content" in parsed){
        const output = generateHTML(parsed.content, [...defaultExtensions]); 
        const note = useNotesStore.getState().getOne(id);
        if(!note) return;
        await API.export(note.title, output, "html");
    }
}
