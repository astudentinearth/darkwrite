import { BaseDirectory, FileEntry, copyFile, exists, readDir, readTextFile, removeFile, renameFile, writeTextFile } from "@tauri-apps/api/fs";
import { NoteFormatting, NoteHeader, NoteInfo, NotebookInfo } from "../Util";
import { isDirectory } from "./Filesystem";

/** Saves a note/creates it if it doesnt exist */
export async function SaveNote(note: NoteInfo){
    if(!await exists(`notes/${note.notebookID}/`,{dir:BaseDirectory.App})) return;
    note.modificationTime = Date.now();
    let str = JSON.stringify(note);
    await writeTextFile(`notes/${note.notebookID}/${note.id}.json`,str,{dir:BaseDirectory.App});
}

/** Deletes a note by its ID, however iterates through every notebook to find it, which is slower. */
export async function DeleteNote(id: string){
    let entries:FileEntry[] = await readDir("notes",{dir: BaseDirectory.App,recursive: true});
    for(let entry of entries){
        if(await isDirectory(entry.path)){
            let sub_entries = await readDir(entry.path,{dir:BaseDirectory.App});
            for (let e of sub_entries){
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
        await removeFile(`notes/${notebookID}/${id}.json`);
    } catch (error) {
        console.error("Could not fast delete note. Maybe its gone already?");
    }
}

/** Gets note headers of all notes in a notebook */
export async function GetNoteHeaders(notebookID:string){
    let headers:NoteHeader[] = []
    let entries = await readDir(`notes/${notebookID}/`,{dir: BaseDirectory.App});
    for(let entry of entries){
        if(await isDirectory(entry.path)) continue;
        if(!entry.path.endsWith(".json")) continue;
        if(entry.path.endsWith("_notebookinf.json")) continue;
        let str = await readTextFile(entry.path);
        let json =JSON.parse(str)
        console.log(str);
        let {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} = json;
        formatting = {background: formatting.background ?? "#FFFFFF", 
                foreground: formatting.background ?? "#000000",
                font: formatting.font ?? "sans-serif"} as NoteFormatting;
        let inf = {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} as NoteHeader;
        headers.push(inf);
    }
    return headers;
}

/** Gets note headers of all notes */
export async function GetAllNoteHeaders(){
    let headers:NoteHeader[] = []
    let entries = await readDir(`notes/`,{dir: BaseDirectory.App, recursive: true});
    console.table(entries);
    for(let entry of entries){
        if(await isDirectory(entry.path)){
            let sub_entries = await readDir(entry.path,{dir:BaseDirectory.App});
            for (let e of sub_entries){
                if(await isDirectory(e.path)) continue;
                if(!e.path.endsWith(".json")) continue;
                if(e.path.endsWith("_notebookinf.json")) continue;
                let str = await readTextFile(e.path);
                let json =JSON.parse(str)
                console.log(str);
                let {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} = json;
                formatting = {background: formatting.background ?? "#FFFFFF", 
                        foreground: formatting.background ?? "#000000",
                        font: formatting.font ?? "sans-serif"} as NoteFormatting;
                let inf = {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} as NoteHeader;
                headers.push(inf);
            }
            continue;
        }
        if(!entry.path.endsWith(".json")) continue;
        if(entry.path.endsWith("_notebookinf.json")) continue;
        let str = await readTextFile(entry.path);
        let json =JSON.parse(str)
        console.log(str);
        let {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} = json;
        formatting = {background: formatting.background ?? "#FFFFFF", 
                foreground: formatting.background ?? "#000000",
                font: formatting.font ?? "sans-serif"} as NoteFormatting;
        let inf = {id, notebookID, pinIndex, pinned, modificationTime, title, formatting} as NoteHeader;
        headers.push(inf);
    }
    console.table(headers);
    return headers;
}

/** Loads the contents of the note.  */
export async function GetNoteContentFromHeader(header: NoteHeader){
    let str = await readTextFile(`notes/${header.notebookID}/${header.id}.json`);
    let json = JSON.parse(str);
    if(json.content == null) return "";
    return json.content.toString();
}

export async function GetNoteInfoFromHeader(header: NoteHeader){
    let str = await readTextFile(`notes/${header.notebookID}/${header.id}.json`,{dir:BaseDirectory.App});
    let json = JSON.parse(str);
    if(json.content == null) return {...header, content: ""} as NoteInfo;

    return {...header, content: json.content.toString()} as NoteInfo;
}

export async function MoveNoteToNotebook(header: NoteHeader, notebookID: string){
    try {
        let str = await readTextFile(`notes/${header.notebookID}/${header.id}.json`);
        let json = JSON.parse(str);
        json.notebookID=notebookID;
        await writeTextFile(`notes/${notebookID}/${header.id}.json`,JSON.stringify(json),{dir: BaseDirectory.App}); // We write before deleting!
        await removeFile(`notes/${header.notebookID}/${header.id}.json`,{dir: BaseDirectory.App});
    } catch (error) {
        console.log("Something went wrong while moving a note");
    }
}