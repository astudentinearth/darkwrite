import { invoke } from "@tauri-apps/api";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appDir } from "@tauri-apps/api/path";
import { useEffect, useState } from "react";

interface INote{
    id:string,
    title:string,
    content:string,
    background:string,
    foreground:string
}

// Convert the notes array to INote array, and does value checking
function ConvertJSONToINote(json:any){
    let ret:INote[]=[];
    json.forEach((element:any) => {
        let n: INote={id:element.id ?? GenerateNoteID(), // if there is not an id, give it an id
            title:element.title ?? "",
            content:element.content ?? "",
            background:element.background ?? "#FFFFFF",
            foreground:element.foreground ?? "#000000"};
        ret.push(n);
        if(n.id.trim()===""){ // check if its just an empty/space string
            n.id=GenerateNoteID();
        }
    });
    return ret;
}

function GenerateNoteID(){
    // time.getTime + 8 digit random number
    let t = new Date();
    let n = Math.floor(Math.random()*(10**8));
    let id:string = t.getTime().toString() + n.toString();
    return id;
}

/*
notes.json structure:
{
    "notes": [INote]
}
*/ 



function NotesPanel(){
    function Note(props:any){
        return <div style={{background:props.background,
        color:props.foreground}} className="p-4 transition-shadow cursor-pointer duration-200 inline-block m-2 rounded-2xl w-64 h-60 shadow-default-hover">
            <h1 className="text-2xl">{props.title}</h1>
            <hr style={{"border":`${props.foreground} 1px solid`,opacity:0.10}}></hr>
            <p>{props.content}</p>
        </div>
    }
    const [notes,setNotes] = useState<INote[]>([]);
    
    async function LoadNotes(){
        console.log("Loading notes...")
        let APPDIR=await appDir();
        if(!await invoke("path_exists",{targetPath:APPDIR+"notes.json"})){
            writeTextFile(APPDIR+"notes.json",`{"notes":[]}`);
        }
        let notesFile=await readTextFile(APPDIR+"notes.json");
        let notesJSON=JSON.parse(notesFile);
        let _notes = ConvertJSONToINote(notesJSON.notes);
        setNotes(_notes);
    }

    let Notes = [{
        id:"00000", 
        title:"Note 1",
        content:"Lorem ipsum",
        background:"#FFFFFF",
        foreground:"#000000"
    },{
        id:"00001", 
        title:"Note 2",
        content:"Lorem ipsum",
        background:"#FFFFAA",
        foreground:"#000000"
    }];
    useEffect(()=>{
        LoadNotes();
    },[])
    return <div id="NotesPanel"
    className={"notes_div p-1 absolute right-0 bottom-0 top-20 m-4 rounded-2xl left-80"}>
        {notes.map((noteobj)=><Note id={noteobj.id} 
        background={noteobj.background} 
        foreground={noteobj.foreground}
        content={noteobj.content}
        title={noteobj.title}></Note>)}
    </div>
}

export default NotesPanel;