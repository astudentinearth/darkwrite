import { NoteMetada } from "@common/note";
import { UserSettings } from "@common/settings";
import { ipcMain } from "electron";
import { createNote, setNoteContents, getNoteContents, deleteNote, moveNote, updateNote, getAllNotes, setTrashStatus } from "./api/note";
import { readUserPrefs, writeUserPrefs } from "./api/settings";

// notes

ipcMain.handle("create-note", async (_event, title: string, parent?: string)=>{
    await createNote(title, parent);
});

ipcMain.handle("set-note-contents", async (_event, id: string, content: string)=>{
    await setNoteContents(id, content);
});

ipcMain.handle("get-note-contents", async (_event, id: string)=>{
    return await getNoteContents(id);
});

ipcMain.handle("delete-note", async (_event, id: string)=>{
    await deleteNote(id);
})

ipcMain.handle("move-note", async (_event, sourceID: string, destID: string)=>{
    await moveNote(sourceID, destID);
})

ipcMain.handle("update-note", async (_event, note: NoteMetada)=>{
    await updateNote(note);
})

ipcMain.handle("get-all-notes", async ()=>{
    return await getAllNotes();
})

ipcMain.handle("set-trash-status", async (_event, id:string, state: boolean)=>{
    await setTrashStatus(id, state);
})

// settings

ipcMain.handle("load-user-settings", async ()=>{
    return await readUserPrefs();
})

ipcMain.handle("save-user-settings", async (_event, data:UserSettings)=>{
    writeUserPrefs(data);
})