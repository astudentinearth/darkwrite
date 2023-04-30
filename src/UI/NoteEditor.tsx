/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { HexToRGB } from "../Theme";
import { NoteInfo } from "../Util";
import { SaveNote } from "../backend/Note";
import { GetLocalizedResource, LocaleContext } from "../localization/LocaleContext";
import logo from '../res/darkwrite_icon.svg';
import { NotifyNoteModification } from "./NotesPanel";

export let ForceSaveOpenNote: ()=>void;

let updateNote: Dispatch<SetStateAction<NoteInfo>>;

export function NoteEditor() {
    const [note, setNote] = useState<NoteInfo>({id: "-1"} as NoteInfo);
    const titleRef: any = useRef(null);
    const {locale} = useContext(LocaleContext);
    useEffect(() => {
        const change = setTimeout(() => {
            if(note.id==="-1") return;
            const time = Date.now()
            SaveNote({...note, modificationTime: time});
            setNote({...note, modificationTime: time})
            NotifyNoteModification(note);
        }, 300);
        return () => clearTimeout(change);
    }, [note]);
    updateNote=setNote;
    ForceSaveOpenNote=()=>{
        if(note.id==="-1") return;
        SaveNote(note);
    }
    NotifyNoteDeletion=(id)=>{
        if(note.id===id)
        setNote({id: "-1"} as NoteInfo);
    }
    return <div id="noteEditDialog" className="transition-all bottom-2 rounded-2xl flex flex-grow flex-col backdrop-blur-md "
        style={{ backgroundColor: note.formatting?.background!=null ? `rgb(${HexToRGB(note.formatting.background)?.r} ${HexToRGB(note.formatting.background)?.g} ${HexToRGB(note.formatting.background)?.b} / 1)` : 'rgba(var(--background-secondary) / 1)'}}>
        {note.id!=="-1" ? 
        <>
            <div className="rounded-t-2xl bg-secondary/75 h-14 flex items-center">
                {/*<ToolbarButton onClick={() => { updateNote(note); }} style={{ background: "transparent", backdropFilter: "none" }} icon="bi-chevron-left"></ToolbarButton>*/}
                <input value={note.title ?? "New note"} onChange={(e) => { setNote({ ...note, title: e.target.value }) }} ref={titleRef} onBlur={(e) => {
                    setNote({ ...note, title: e.target.value });
                }} onKeyDown={(e) => {
                    if (e.key === "Enter") titleRef.current.blur();
                }} className="flex-[1_1_48px] m-1 h-12 rounded-tr-xl p-1 bg-transparent outline-none text-xl"></input>
            </div>
            <div className="flex-[0_1_0%] bg-secondary/75">
                <div className="p-2">
                    <input type={"color"} value={note.formatting.background} onChange={(e) => {
                        setNote({ ...note, formatting:{...note.formatting,background: e.target.value} })
                    }} className="flex mr-1 mb-1 float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 rounded-lg">

                    </input>
                    <input type={"color"} value={note.formatting.foreground} onChange={(e) => {
                        setNote({ ...note, formatting: {...note.formatting, foreground: e.target.value} })
                    }} className="flex float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 rounded-lg">

                    </input>
                    <div className="clear-both"></div>
                </div>
            </div>
            <div className="flex-[1_1_auto] ">
                <textarea value={note.content ?? ""} onChange={(e) => { setNote({ ...note, content: e.target.value }) }} onBlur={(e) => {
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