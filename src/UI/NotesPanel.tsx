import { invoke } from "@tauri-apps/api";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appDir } from "@tauri-apps/api/path";
import React, { useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react";
import { HexToRGB, RGBToHex } from "../Theme";
import { ConvertJSONToINote, FontStyle, GenerateID, GetNotebooks, INote } from "../Util";
import ToolbarButton from "./Components/ToolbarButton";

/**
 * Get an INote from ID
 */
let getNote: (id: string) => INote;

/**
 * Update an existing note, or create the note if it doesn't have an ID assigned.
 */
let updateNote: (note: INote) => void;
let getNotebook: ()=>string;
let showEditor:(noteID:string) => void;
let setNotebookFilter:(notebookID:string)=>void;
function NoteEditor() {
    const [isVisible,setVisibility] = useState(false);
    const [note,setNote] = useState({} as INote);
    showEditor = (id:string) => {
        let note = getNote(id);
        setNote(note);
        setVisibility(true);
    }
    const getFont=()=>{
        switch (note.font){
            case FontStyle.Sans:
                return "f-sans";
            case FontStyle.Serif:
                return "f-serif";
            case FontStyle.Monospace:
                return "f-mono";
            case FontStyle.Handwriting:
                return "f-hand";
            default:
                return "";
        }
    }
    let customFontRef:any=useRef(null);
    let titleRef:any = useRef(null);
    useEffect(()=>{
        const change = setTimeout(()=>{
            if(isVisible===true) updateNote(note);
        },1000);
        return ()=>clearTimeout(change);
    },[note]);
    return <div id="noteEditDialog" className="fixed transition-all top-16 right-2
    left-[20rem] bottom-2 rounded-2xl flex flex-col"
    style={{ display: isVisible ? "flex" : "none",backgroundColor:`rgb(${HexToRGB(note.background)?.r} ${HexToRGB(note.background)?.g} ${HexToRGB(note.background)?.b} / 1)`}}>
        <div className="rounded-t-2xl bg-secondary/75 h-14 flex items-center">
            <ToolbarButton onClick={()=>{setVisibility(false); updateNote(note)}} style={{"background":"transparent"}} icon="bi-chevron-left"></ToolbarButton>
            <input value={note.title ?? "New note"} onChange={(e)=>{setNote({...note, title:e.target.value})}} ref={titleRef} onBlur={(e)=>{
                setNote({...note, title: e.target.value});
            }} onKeyDown={(e)=>{
                if (e.key==="Enter") titleRef.current.blur();
            }} className="flex-[1_1_48px] m-1 h-12 rounded-tr-xl p-1 bg-transparent outline-none text-xl"></input>
        </div>
        <div className="flex-[0_1_0%] bg-secondary/75">
            <div className="p-2">
                <div className="bg-secondary transition-all float-left w-max flex mr-1 mb-1 items-center rounded-lg">
                    <div onClick={()=>{
                        setNote({...note , font:FontStyle.Sans} as INote)
                    }} 
                    style={note.font===FontStyle.Sans ? {backgroundColor:"rgb(var(--accent))",color:"white"} : {}}
                    className="flex f-sans float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg"
                    >Aa</div>
                    <div onClick={()=>{
                        setNote({...note , font:FontStyle.Serif} as INote)
                    }} 
                    style={note.font===FontStyle.Serif ? {backgroundColor:"rgb(var(--accent))",color:"white"} : {}}
                    
                     className="flex f-serif float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">Aa</div>
                    <div onClick={()=>{
                        setNote({...note , font:FontStyle.Monospace} as INote)
                    }} 
                    style={note.font===FontStyle.Monospace ? {backgroundColor:"rgb(var(--accent))",color:"white"} : {}}
                     className="flex f-mono float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">Aa</div>
                    <div onClick={()=>{
                        setNote({...note , font:FontStyle.Handwriting} as INote)
                    }} 
                    style={note.font===FontStyle.Handwriting ? {backgroundColor:"rgb(var(--accent))",color:"white"} : {}}
                     className="flex f-hand float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">Aa</div>
                    <div onClick={()=>{
                        setNote({...note , font:FontStyle.Custom} as INote)
                    }} 
                    style={note.font===FontStyle.Custom ? {backgroundColor:"rgb(var(--accent))",color:"white"} : {}}
                     className="flex float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">
                        <i className="bi-three-dots"></i>
                    </div>
                    <input ref={customFontRef} onBlur={(e)=>{
                        setNote({...note, customFontFamily: e.target.value} as INote);
                    }} onKeyDown={(e)=>{
                        if(e.key==="Enter"){
                            customFontRef.current.blur();
                        }
                    }} placeholder="Custom font" defaultValue={note.customFontFamily} style={note.font===FontStyle.Custom ? {} : {display:"none"}} className="w-48 h-10 outline-none transition-all focus:border-accent focus:border-2 p-1 bg-transparent block rounded-lg"></input>
                </div>
                <input type={"color"} value={note.background} onChange={(e)=>{
                    setNote({...note, background: e.target.value})
                }} className="flex mr-1 mb-1 float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 rounded-lg">
                   
                </input>
                <input type={"color"} value={note.foreground} onChange={(e)=>{
                    setNote({...note, foreground: e.target.value})
                }} className="flex float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 rounded-lg">
                   
                </input>
                <div className="clear-both"></div>
            </div>
       </div>
    <div className="flex-[1_1_auto] ">
            <textarea value={note.content ?? ""} onChange={(e)=>{setNote({...note, content:e.target.value})}} onBlur={(e)=>{
                setNote({...note , content:e.target.value})
            }} style={{fontFamily: note.font===FontStyle.Custom ? note.customFontFamily : "", color:note.foreground}} className={"w-full h-full box-border bg-transparent p-2 outline-none resize-none "+getFont()}>
            
            </textarea>
       </div>
       
    </div>;
}




function NotesPanel() {
    function Note(props: any) {
        const getFont=()=>{
            switch(props.font){
                case FontStyle.Sans:
                    return "f-sans";

                case FontStyle.Serif:
                    return "f-serif";

                case FontStyle.Monospace:
                    return "f-mono";

                case FontStyle.Handwriting:
                    return "f-hand"

                default:
                    return ""; 
            }
        }
        return <div onClick={props.onClick} style={{
            background: props.background,
            color: props.foreground,
            fontFamily: props.font === FontStyle.Custom ? props.customFont : ""
        }} className={"p-4 transition-all cursor-pointer overflow-y-clip duration-200 inline-block m-2 rounded-2xl w-64 h-60 drop-shadow-none "+getFont()}>
            <h1 className="text-2xl truncate">{props.title}</h1>
            <hr style={{ "border": `${props.foreground} 1px solid`, opacity: 0.10 }}></hr>
            <span className="text-ellipsis break-words">{props.content} &nbsp;</span>
        </div>
    }
    const [notes, setNotes] = useState<INote[]>([]);
    const [notebook, setNotebook] = useState("0");
    const isFirstRender=useRef(true);

    setNotebookFilter=(notebookID:string)=>{
        setNotebook(notebookID);
    }; 
    getNotebook=()=>{return notebook;};
    getNote = (id: string) => {
        for (let n of notes) {
            if (n.id === id) return n;
        }
        return {id: id, title:"New Note", content:"", background: "#393939", foreground: "#ffffff",font: FontStyle.Sans,notebookID:notebook} as INote;
    }
    async function LoadNotes() {
        console.log("[INFO] Loading notes")
        let APPDIR = await appDir();
        if (!await invoke("path_exists", { targetPath: APPDIR + "notes.json" })) {
            writeTextFile(APPDIR + "notes.json", `{"notes":[]}`);
        }
        let notesFile = await readTextFile(APPDIR + "notes.json");
        let notesJSON = JSON.parse(notesFile);
        let _notes = ConvertJSONToINote(notesJSON.notes);
        setNotes(_notes);
    }
    updateNote=(x:INote)=>{
        console.log(`Updating note: ${x.id}`)
        let done=false;
        for(let i in notes){
            if(x.id===notes[i].id){
                let currentNotes=Array.from(notes);
                currentNotes[i]=x;
                setNotes(currentNotes);
                done=true;
                return;
            }
        }
        if (done===false){
            let currentNotes=Array.from(notes);
            currentNotes.push(x);
            setNotes(currentNotes);
        }
        
    };
    async function SaveNotes() {
        console.log("[INFO] Saving notes");
        await writeTextFile("notes.json", JSON.stringify({ "notes": notes, "notebooks":GetNotebooks() }), { dir: BaseDirectory.App });
    }
    useEffect(() => {
        LoadNotes();
    }, [])
    useLayoutEffect(()=>{
        if(isFirstRender.current){
            isFirstRender.current=false;
            return;
        }
        console.log("saving notes")
        SaveNotes();
    },[notes]);
    return <div id="NotesPanel"
        className={"notes_div  fixed overflow-y-scroll top-16 bottom-2 right-2 transition-all rounded-2xl left-80"}>
        {notes.filter(n=>n.notebookID==notebook).map((noteobj) => <Note onClick={()=>{showEditor(noteobj.id)}} id={noteobj.id}
            background={noteobj.background}
            foreground={noteobj.foreground}
            content={noteobj.content}
            font={noteobj.font}
            customFont={noteobj.customFontFamily}
            title={noteobj.title}></Note>)}
        <NoteEditor></NoteEditor>
    </div>
}

export {showEditor, NotesPanel, getNotebook,setNotebookFilter}
