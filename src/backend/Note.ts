import { BaseDirectory, FileEntry, exists, readDir, readTextFile, removeFile, writeTextFile } from "@tauri-apps/api/fs";
import { NoteFormatting, NoteHeader, NoteInfo } from "../Util";
import { isDirectory } from "./Filesystem";

/** Saves a note/creates it if it doesnt exist */
export async function SaveNote(note: NoteInfo){
    if(!await exists(`notes/${note.notebookID}/`,{dir:BaseDirectory.App})) return;
    note.modificationTime = Date.now();
    const str = JSON.stringify(note);
    await writeTextFile(`notes/${note.notebookID}/${note.id}.json`,str,{dir:BaseDirectory.App});
}

/** Deletes a note by its ID, however iterates through every notebook to find it, which is slower. */
export async function DeleteNote(id: string){
    const entries:FileEntry[] = await readDir("notes",{dir: BaseDirectory.App,recursive: true});
    for(const entry of entries){
        if(await isDirectory(entry.path)){
            const sub_entries = await readDir(entry.path,{dir:BaseDirectory.App});
            for (const e of sub_entries){
                if(await isDirectory(e.path)) continue;
                if (e.name==null) continue;
                if(e.name===id+".json"){
                    try{
                        removeFile(e.path);
                    }
                    catch (error){
                        if(error instanceof Error) console.error(error.message,error.cause,error.name,error.stack);
                        console.error("An error occured while deleting a note (slow method). Aborting.");
                    }
                }
            }
            continue;
        }
        try {
            if(entry.name==null) continue;
            if(entry.name===id+".json"){
                removeFile(entry.path);
            }
        } catch (error) {
            if(error instanceof Error) console.error(error.message,error.cause,error.name,error.stack);
            console.error("An error occured while deleting a note (slow method). Aborting.");
        }
    }
}

/** Deletes a note by its ID but navigates directly to the notebook. This deletes the notebook instantly while the above 
 * implementation has a completion time depending on the amount of notes and notebooks created.
 */
export async function FastDeleteNote(id: string, notebookID: string){
    try {
        await removeFile(`notes/${notebookID}/${id}.json`,{dir:BaseDirectory.App});
    } catch (error) {
        console.error("Could not fast delete note. Maybe its gone already?");
    }
}

/** Gets note headers of all notes in a notebook */
export async function GetNoteHeaders(notebookID:string){
    const headers:NoteHeader[] = []
    const entries = await readDir(`notes/${notebookID}/`,{dir: BaseDirectory.App});
    for(const entry of entries){
        if(await isDirectory(entry.path)) continue;
        if(!entry.path.endsWith(".json")) continue;
        if(entry.path.endsWith("_notebookinf.json")) continue;
        const str = await readTextFile(entry.path);
        const json =JSON.parse(str)
        console.log(str);
        const {id, notebookID, pinIndex, pinned, modificationTime, title} = json;
        let {formatting} = json;
        formatting = {background: formatting.background ?? "#FFFFFF", 
                foreground: formatting.foreground ?? "#000000",
                font: formatting.font ?? "sans-serif"} as NoteFormatting;
        const inf = {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} as NoteHeader;
        headers.push(inf);
    }
    return headers;
}

/** Gets note headers of all notes */
export async function GetAllNoteHeaders(){
    const headers:NoteHeader[] = []
    const entries = await readDir(`notes/`,{dir: BaseDirectory.App, recursive: true});
    console.table(entries);
    for(const entry of entries){
        if(await isDirectory(entry.path)){
            const sub_entries = await readDir(entry.path,{dir:BaseDirectory.App});
            for (const e of sub_entries){
                if(await isDirectory(e.path)) continue;
                if(!e.path.endsWith(".json")) continue;
                if(e.path.endsWith("_notebookinf.json")) continue;
                const str = await readTextFile(e.path);
                const json =JSON.parse(str)
                console.log(str);
                const {id, notebookID, pinIndex, pinned, modificationTime, title} = json;
                let {formatting} = json;
                formatting = {background: formatting.background ?? "#FFFFFF", 
                        foreground: formatting.foreground ?? "#000000",
                        font: formatting.font ?? "sans-serif"} as NoteFormatting;
                const inf = {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} as NoteHeader;
                headers.push(inf);
            }
            continue;
        }
        if(!entry.path.endsWith(".json")) continue;
        if(entry.path.endsWith("_notebookinf.json")) continue;
        const str = await readTextFile(entry.path);
        const json =JSON.parse(str)
        console.log(str);
        const {id, notebookID, pinIndex, pinned, modificationTime, title} = json;
        let {formatting} = json;
        formatting = {background: formatting.background ?? "#FFFFFF", 
                foreground: formatting.background ?? "#000000",
                font: formatting.font ?? "sans-serif"} as NoteFormatting;
        const inf = {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} as NoteHeader;
        headers.push(inf);
    }
    console.table(headers);
    return headers;
}

/** Loads the contents of the note.  */
export async function GetNoteContentFromHeader(header: NoteHeader){
    const str = await readTextFile(`notes/${header.notebookID}/${header.id}.json`);
    const json = JSON.parse(str);
    if(json.content == null) return "";
    return json.content.toString();
}

export async function GetNoteInfoFromHeader(header: NoteHeader){
    const str = await readTextFile(`notes/${header.notebookID}/${header.id}.json`,{dir:BaseDirectory.App});
    const json = JSON.parse(str);
    if(json.content == null) return {...header, content: ""} as NoteInfo;

    return {...header, content: json.content.toString()} as NoteInfo;
}

export async function MoveNoteToNotebook(header: NoteHeader, notebookID: string){
    try {
        const str = await readTextFile(`notes/${header.notebookID}/${header.id}.json`);
        const json = JSON.parse(str);
        json.notebookID=notebookID;
        await writeTextFile(`notes/${notebookID}/${header.id}.json`,JSON.stringify(json),{dir: BaseDirectory.App}); // We write before deleting!
        await removeFile(`notes/${header.notebookID}/${header.id}.json`,{dir: BaseDirectory.App});
    } catch (error) {
        console.log("Something went wrong while moving a note");
    }
}