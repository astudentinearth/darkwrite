/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { getFonts } from "../API";
import { HexToRGB } from "../Theme";
import { NoteHeader, NoteInfo } from "../Util";
import { SaveNote } from "../backend/Note";
import { GetLocalizedResource, LocaleContext } from "../localization/LocaleContext";
import logo from '../res/darkwrite_icon.svg';
import { NotifyNoteModification } from "./NotesPanel";

export let ForceSaveOpenNote: ()=>void;
export let NotifyNoteMovement: (note: NoteHeader | NoteInfo) => void;
export let NotifyPinChange: (note: NoteHeader | NoteInfo) => void;


let updateNote: Dispatch<SetStateAction<NoteInfo>>;


export function NoteEditor() {
    const [note, setNote] = useState<NoteInfo>({id: "-1"} as NoteInfo);
    const titleRef: any = useRef(null);
    const {locale} = useContext(LocaleContext);
    const [fonts, setFonts] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<boolean>(false);
    const editorRootRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(()=>{
        if(editorRootRef.current==null) return;
        if(expanded===true){
            editorRootRef.current.style.setProperty("left", `${editorRootRef.current.getBoundingClientRect().x}px`);
            
            editorRootRef.current.style.setProperty("left", "8px");
            editorRootRef.current.style.setProperty("right", "8px");
            editorRootRef.current.style.setProperty("top", `${editorRootRef.current.getBoundingClientRect().y}px`);
            editorRootRef.current.style.setProperty("bottom", "8px");
            editorRootRef.current.style.setProperty("position", "absolute");
        }
        else{
            editorRootRef.current.style.setProperty("position", "static");
            editorRootRef.current.style.setProperty("left", `${editorRootRef.current.getBoundingClientRect().x}px`);
        }
    },[expanded]);
    useEffect(() => {
        if(note.id==="-1") setExpanded(false);
        const change = setTimeout(() => {
            if(note.id==="-1") return;
            const time = Date.now()
            SaveNote({...note, modificationTime: time});
            setNote({...note, modificationTime: time})
            NotifyNoteModification(note);
        }, 300);
        return () => clearTimeout(change);
    }, [note]);
    useEffect(()=>{
        const load = async ()=>{setFonts(await getFonts())};
        load();
    },[]);
    updateNote=setNote;
    ForceSaveOpenNote=()=>{
        if(note.id==="-1") return;
        SaveNote(note);
    }
    NotifyNoteDeletion=(id)=>{
        if(note.id===id)
        setNote({id: "-1"} as NoteInfo);
    }
    NotifyNoteMovement=(n)=>{
        if(n.id===note.id){
            setNote({id: "-1"} as NoteInfo);
        }
    }
    NotifyPinChange=(n)=>{
        if(n.id===note.id){
            setNote({...note, pinned: n.pinned, pinIndex: n.pinIndex})
        }
    }
    return <div id="noteEditDialog" ref={editorRootRef} className="transition-all z-30 bottom-2 rounded-2xl flex flex-grow flex-col backdrop-blur-md "
        style={{ backgroundColor: note.formatting?.background!=null ? `rgb(${HexToRGB(note.formatting.background)?.r} ${HexToRGB(note.formatting.background)?.g} ${HexToRGB(note.formatting.background)?.b} / 1)` : 'rgba(var(--background-secondary) / 1)'}}>
        {note.id!=="-1" ? 
        <>
            <div className="flex-[0_1_0%] rounded-t-2xl flex flex-wrap p-2 bg-primary">
                    <div className="w-8 h-8 transition-colors hover:bg-hover box-shadow-0-2-8-0 bg-secondary rounded-lg mr-1 float-left flex items-center justify-center" onClick={()=>{setExpanded(!expanded)}}>
                        {expanded ? <i className="bi-arrows-angle-contract"></i> : <i className="bi-arrows-angle-expand"></i>}
                    </div>
                    <select style={{fontFamily: note.formatting.font}} className="font-select transition-colors hover:bg-hover block w-32 flex-shrink float-left mr-1 h-8" value={note.formatting.font} onChange={(e)=>{setNote({...note, formatting: {...note.formatting, font:e.target.value}})}}>
                        {fonts.map((f)=><option key={f} value={f}>{f}</option>)}
                    </select>
                    <input type={"color"} value={note.formatting.background} onChange={(e) => {
                        setNote({ ...note, formatting:{...note.formatting,background: e.target.value} })
                    }} className="flex color-input-fill mr-1 mb-1 float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-8 bg-widget h-8 rounded-lg">

                    </input>
                    <input type={"color"} value={note.formatting.foreground} onChange={(e) => {
                        setNote({ ...note, formatting: {...note.formatting, foreground: e.target.value} })
                    }} className="flex float-left mr-1 text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-8 bg-widget h-8 rounded-lg">

                    </input>
                    <div className="clear-both"></div>
            </div>
            <div className="rounded-t-2xl bg-transparent h-14 flex-col items-center">
                <input style={{ fontFamily: note.formatting.font, color: note.formatting.foreground}} value={note.title ?? "New note"} onChange={(e) => { setNote({ ...note, title: e.target.value }) }} ref={titleRef} onBlur={(e) => {
                    setNote({ ...note, title: e.target.value });
                }} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        titleRef.current.blur();
                        textAreaRef.current?.focus();
                    }
                }} className="flex-[1_1_48px] w-full p-2 flex h-12 rounded-tr-xl bg-transparent outline-none text-xl"></input>
                <div style={{background: note.formatting.foreground}} className="mx-2 h-[1px] opacity-50"></div>
            </div>
            <div className="flex-[1_1_auto] ">
                <textarea ref={textAreaRef} value={note.content ?? ""} onChange={(e) => { setNote({ ...note, content: e.target.value }) }} onBlur={(e) => {
                    setNote({ ...note, content: e.target.value })
                }} style={{ fontFamily: note.formatting.font, color: note.formatting.foreground}} className={"w-full h-full box-border bg-transparent p-2 outline-none resize-none"}>

                </textarea>
            </div>
        </> : <div className="flex flex-1 items-center justify-center flex-col text-center">
                <img src={logo} className="w-48 h-48 block"></img>
                <span className="block text-2xl font-bold">{GetLocalizedResource("noteEditorWelcomeMessage", locale)}</span>
                <span className="block text-xl">{GetLocalizedResource("noteEditorWelcomeMessage2", locale)}</span>
        </div>}
        
    </div>;
}

export function ShowNoteEditor(note: NoteInfo){
    ForceSaveOpenNote();
    updateNote(note);
}

export let NotifyNoteDeletion: (id: string) => void;