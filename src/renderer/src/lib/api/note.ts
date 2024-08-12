import { NoteMetada } from "@common/note";

const API = window.api.note; // electron API

export async function createNote(title:string, parent?: string){
    API.create(title, parent);
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

export async function updateNote(data: Partial<NoteMetada>){
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

export async function saveAll(notes: NoteMetada[]){
    await API.saveAll(notes);
}