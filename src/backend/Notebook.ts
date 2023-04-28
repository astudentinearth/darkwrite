import { BaseDirectory, FileEntry, createDir, exists, readDir, readTextFile, removeDir, writeFile, writeTextFile } from "@tauri-apps/api/fs";
import { NotebookInfo, GenerateID } from "../Util";
import { isDirectory } from "./Filesystem";

/** Creates a new notebook
 * @param name Notebook name
 */
export async function CreateNotebook(name:string){
    // Generate an ID. If that ID for some reason already exists, recurse the function and try again with a new ID
    const id = GenerateID();
    if(await exists("notes/"+id, {dir: BaseDirectory.App})) CreateNotebook(name);
    await createDir("notes/"+id,{dir: BaseDirectory.App, recursive: true});
    const info = {name: name, id: id} as NotebookInfo;
    await writeFile("notes/"+id+"/_notebookinf.json",JSON.stringify(info),{dir:BaseDirectory.App});
}

/** Gets all notebook names and IDs
 * @returns An array of NotebookInfo objects
 */
export async function GetNotebookHeaders() : Promise<NotebookInfo[]> {
    const entries:FileEntry[] = await readDir("notes",{dir: BaseDirectory.App});
    const headers:NotebookInfo[] = [];
    for(const entry of entries){
        if(!await isDirectory(entry.path)) continue;
        try {
            console.log(entry.path);
            if(!await exists(entry.path+"/_notebookinf.json",{dir: BaseDirectory.App})) continue;
            const inf = await readTextFile(entry.path+"/_notebookinf.json",{dir: BaseDirectory.App});
            if (inf == null) continue;
            const json = JSON.parse(inf);
            headers.push({...json} as NotebookInfo);
        } catch (error) {
            if(error instanceof Error) console.error(error.message,error.cause,error.name,error.stack);
            console.error("An error occured while loading notebook headers. Aborting.");
        }
    }
    console.log("Found following notebook headers");
    console.table(headers);
    if(headers.length===0){
        CreateNotebook("$default");
    }
    return headers;
}

/** Renames a notebook.
 * @returns A status code number.
 * Status codes:
 * 0: Notebook renamed.
 * 1: Notebook doesn't exist.
 * 2: Notebook has a directory, but it doesn't have a _notebookinf.json file.
 * 99: Other unknown failure. Check DevTools for exception message.
 */
export async function RenameNotebook(id: string, newName: string){
    if(!await exists(`notes/${id}/`,{dir: BaseDirectory.App})) return 1;
    if(!await exists(`notes/${id}/_notebookinf.json`,{dir: BaseDirectory.App})) return 2;
    try {
        const inf = await readTextFile(`notes/${id}/_notebookinf.json`,{dir: BaseDirectory.App});
        if (inf==null) return 99;
        const info = JSON.parse(inf) as NotebookInfo;
        if(info == null) return 99;
        info.name=newName;
        writeTextFile(`notes/${id}/_notebookinf.json`,JSON.stringify(info),{dir:BaseDirectory.App});
        return 0;
    } catch (error) {
        if (error instanceof Error) console.error(`Unknown error at RenameNotebook(). Error name: ${error.name} | Stack: ${error.stack} | Cause: ${error.cause} | Message: ${error.message}`);
        return 99;
    }
    return 99;
}

/** Nukes a notebook - with everything inside. */
export async function DeleteNotebook(id: string){
    if(!await exists(`notes/${id}/`,{dir: BaseDirectory.App})) return;
    await removeDir(`notes/${id}/`,{dir: BaseDirectory.App, recursive:true});
}