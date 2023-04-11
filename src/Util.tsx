/**
 * Type of font to be used in a note.
 */

import { fs } from "@tauri-apps/api"
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import React from "react"

/** @deprecated */
enum FontStyle{
    Sans=0,
    Serif=1,
    Monospace=2,
    Handwriting=3,
    Custom=4
}

/**
 * Data structure for a note.
 * @deprecated use NoteInfo and NoteHeader instead
 */
interface INote{
    id:string,
    title:string,
    content:string,
    background:string,
    foreground:string,
    font:FontStyle,
    customFontFamily?:string,
    notebookID:string
}
/** @deprecated Use NotebookInfo instead */
interface INotebook{
    id:string,
    name:string
}

/**
 * Data structure for a task.
 */
interface ITask{
    id:string,
    content:string,
    completed:boolean
}

export const DraggableTypes={
    TASK: "TASK",
    NOTE: "NOTE"
}

/**
 * User data interface to be loaded. Contains notes and tasks.
 */
interface IAppData{
    notes:INote[],
    tasks:INote[]
}


/**
 * Get a font style from string
 * @param str 
 * @returns Relevant FontStyle
 */
function FontStyleFromString(str:string){
    switch(str){
        case "sans":
            return FontStyle.Sans;

        case "serif":
            return FontStyle.Serif;

        case "handwriting":
            return FontStyle.Handwriting;

        case "mono":
            return FontStyle.Monospace;

        default:
            return FontStyle.Custom;
    }
}

/**
 * Converts a byte array to base64
 * @param buf Target byte array (Uint8Array)
 * @returns Base64 encoded string
 */
async function Uint8ArrayToBase64(buf:Uint8Array){
    /*let len=buf.byteLength;
    let bin = '';
    for(let i = 0; i<len;i++){
        bin+=String.fromCharCode(buf[i]);
    }
    return window.btoa(bin);*/
    const dataURL = await new Promise((r)=>{
        const reader = new FileReader();
        reader.onload = () => r(reader.result);
        reader.readAsDataURL(new Blob([buf]));
    })
    return dataURL;
}

/**
 * Converts a JSON object to INote
 * @param json target json object
 * @returns INote based on the JSON object with missing params completed
 * TODO: Pending reimplementation for new format
 */
function ConvertJSONToINote(json:any){
    let ret:INote[]=[];
    json.forEach((element:any) => {
        let n: INote={id:element.id ?? GenerateID(), // if there is not an id, give it an id
            title:element.title ?? "",
            content:element.content ?? "",
            background:element.background ?? "#FFFFFF",
            foreground:element.foreground ?? "#000000",
            font:element.font ?? FontStyle.Sans,
            customFontFamily:element.customFontFamily ?? "",
            notebookID:element.notebookID ?? "0"};
        ret.push(n);
        if(n.id.trim()===""){ // check if its just an empty/space string
            n.id=GenerateID();
        }
    });
    return ret;
}
function ConvertJSONToINotebook(json:any){
    let ret:INotebook[]=[];
    json.forEach((element:any)=>{
        let n:INotebook={id:element.id ?? GenerateID(),
        name:element.name ?? "Unnamed Notebook"};
        ret.push(n);
    });
    return ret;
}

async function GetNotebooks(){
    if(!await fs.exists("notebooks.json",{dir:BaseDirectory.App})){
        console.log("Notebooks file not found");
        await writeTextFile("notebooks.json",`{notebooks:[]}`,{dir:BaseDirectory.App});
    }
    let notebooks_plain = await readTextFile("notebooks.json",{dir: BaseDirectory.App});
    console.log(notebooks_plain);
    let notebooksJSON:any = JSON.parse(notebooks_plain);
    if(notebooksJSON.notebooks == null) return [{id: "0",name:"My Notes"}] as INotebook[];
    if(notebooksJSON.notebooks.length===0){
        console.log("No notebooks were found. Creating default one.")
        return [{id: "0",name:"My Notes"}] as INotebook[];
    }
    return (notebooksJSON.notebooks ?? [{id: "0",name:"My Notes"}]) as INotebook[];
}


/**
 * Generates a unique identifier to be attached to notes.
 * @returns Unique ID using the current timestamp combined with a 8 digit random number
 */
function GenerateID(){
    // time.getTime + 8 digit random number
    let t = new Date();
    let n = Math.floor(Math.random()*(10**8));
    let id:string = t.getTime().toString() + n.toString();
    return id;
}

/** Convert the data from tasks.json to an array of tasks with null checking.
 * @returns ITask[]
 */
function JSONToITaskArray(json:any){
    let tasks = [] as ITask[];
    for(let t of json.tasks){
        tasks.push(
            {
                content: t.content ?? "Task",
                id: t.id ?? GenerateID(),
                completed: t.completed ?? false
            } as ITask
        );
    }
    return tasks;
}
// TODO: Move to a JSON object
const DefaultSettings:string=`
{
    "version":"1",
    "theme":"dark",
    "themeFile":"colors_dark.json",
    "font":"Roboto",
    "accentColor":"87 104 225",
    "sansFont":"Roboto",
    "serifFont":"Roboto Slab",
    "monoFont":"Roboto Mono",
    "handFont":"Yellowtail"
}`

/** Color and font data for note */
export interface NoteFormatting{
    /** Hexadecimal representation of the note background color */
    background: string;
    /** Hexadecimal representation of the note text color */
    foreground: string;
    /** Font family name of the note */
    font: string;
}
/**
 * Basic notebook data
 */
export interface NotebookInfo{
    /** Unique identifier for the notebook */
    id: string; 
    /** Name of the notebook */
    name: string;
}

/** Minimum required information for the note to be rendered in a list */
export interface NoteHeader{
    /** ID of the note */
    id: string;
    /** Formatting information of the note */
    formatting: NoteFormatting;
    /** Title of the note */
    title: string;
    /** Identifier of the notebook which the note belongs to */
    notebookID: string;
    /** Whether the note is pinned or not */
    pinned: boolean;
    /** Pinning index of the note among other pinned notes */
    pinIndex: number;
    /** Timestamp of note creation */
    creationTime: number;
}

/** Complete information about the note, including its contents
 *  @extends NoteHeader
 */
export interface NoteInfo extends NoteHeader{
    /** Text content of the note */
    content: string;
}

export { Uint8ArrayToBase64, GenerateID, ConvertJSONToINote, FontStyle,JSONToITaskArray,ConvertJSONToINotebook, GetNotebooks, DefaultSettings };
export type {INote, ITask, IAppData, INotebook };
