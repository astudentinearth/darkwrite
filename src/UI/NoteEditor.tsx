import { useEffect, useRef, useState } from "react";
import { HexToRGB } from "../Theme";
import { FontStyle, INote } from "../Util";
import { getNote, updateNote } from "./NotesPanel";
import logo from '../res/darkwrite_icon.svg'

export let showEditor: (noteID: string) => void;
export function NoteEditor() {
    const [isVisible, setVisibility] = useState(true);
    const [note, setNote] = useState({id:"-1"} as INote);
    showEditor = (id: string) => {
        console.log("showing editor")
        if (id==="-1") {setNote({id:"-1"} as INote); return;}
        let note = getNote(id);
        setNote(note);
        updateNote(note);
        setVisibility(true);
    }
    const getFont = () => {
        switch (note.font) {
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
    let customFontRef: any = useRef(null);
    let titleRef: any = useRef(null);
    useEffect(() => {
        const change = setTimeout(() => {
            if (note.id!=="-1") updateNote(note);
        }, 300);
        return () => clearTimeout(change);
    }, [note]);
    return <div id="noteEditDialog" className="fixed transition-all top-16 right-2
    left-[38rem] bottom-2 rounded-2xl flex flex-col backdrop-blur-md "
        style={{ display: isVisible ? "flex" : "none", backgroundColor: 
        note.background ? `rgb(${HexToRGB(note.background)?.r} ${HexToRGB(note.background)?.g} ${HexToRGB(note.background)?.b} / 1)` : 'rgba(var(--background-secondary) / 1)'}}>
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
                    <div className="bg-secondary transition-all  drop-shadow-lg shadow-black float-left w-max flex mr-1 mb-1 items-center rounded-lg">
                        <div onClick={() => {
                            setNote({ ...note, font: FontStyle.Sans } as INote)
                        }}
                            style={note.font === FontStyle.Sans ? { backgroundColor: "rgb(var(--accent))", color: "white" } : {}}
                            className="flex f-sans float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg"
                        >Aa</div>
                        <div onClick={() => {
                            setNote({ ...note, font: FontStyle.Serif } as INote)
                        }}
                            style={note.font === FontStyle.Serif ? { backgroundColor: "rgb(var(--accent))", color: "white" } : {}}

                            className="flex f-serif float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">Aa</div>
                        <div onClick={() => {
                            setNote({ ...note, font: FontStyle.Monospace } as INote)
                        }}
                            style={note.font === FontStyle.Monospace ? { backgroundColor: "rgb(var(--accent))", color: "white" } : {}}
                            className="flex f-mono float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">Aa</div>
                        <div onClick={() => {
                            setNote({ ...note, font: FontStyle.Handwriting } as INote)
                        }}
                            style={note.font === FontStyle.Handwriting ? { backgroundColor: "rgb(var(--accent))", color: "white" } : {}}
                            className="flex f-hand float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">Aa</div>
                        <div onClick={() => {
                            setNote({ ...note, font: FontStyle.Custom } as INote)
                        }}
                            style={note.font === FontStyle.Custom ? { backgroundColor: "rgb(var(--accent))", color: "white" } : {}}
                            className="flex float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 p-2 rounded-lg">
                            <i className="bi-three-dots"></i>
                        </div>
                        <input ref={customFontRef} onBlur={(e) => {
                            setNote({ ...note, customFontFamily: e.target.value } as INote);
                        }} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                customFontRef.current.blur();
                            }
                        }} placeholder="Custom font" defaultValue={note.customFontFamily} style={note.font === FontStyle.Custom ? {} : { display: "none" }} className="w-36 h-10 outline-none transition-all focus:border-accent focus:border-2 p-1 bg-transparent block rounded-lg"></input>
                    </div>
                    <input type={"color"} value={note.background} onChange={(e) => {
                        setNote({ ...note, background: e.target.value })
                    }} className="flex mr-1 mb-1 float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 rounded-lg">

                    </input>
                    <input type={"color"} value={note.foreground} onChange={(e) => {
                        setNote({ ...note, foreground: e.target.value })
                    }} className="flex float-left text-center cursor-pointer hover:bg-hover transition-all items-center justify-center w-10 bg-secondary h-10 rounded-lg">

                    </input>
                    <div className="clear-both"></div>
                </div>
            </div>
            <div className="flex-[1_1_auto] ">
                <textarea value={note.content ?? ""} onChange={(e) => { setNote({ ...note, content: e.target.value }) }} onBlur={(e) => {
                    setNote({ ...note, content: e.target.value })
                }} style={{ fontFamily: note.font === FontStyle.Custom ? note.customFontFamily : "", color: note.foreground }} className={"w-full h-full box-border bg-transparent p-2 outline-none resize-none " + getFont()}>

                </textarea>
            </div>
        </> : <div className="flex flex-1 items-center justify-center flex-col text-center">
                <img src={logo} className="w-48 h-48 block"></img>
                <span className="block text-2xl font-bold">Welcome</span>
                <span className="block text-xl">Create or select a note to begin.</span>
        </div>}
        
    </div>;
}
