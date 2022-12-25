import { invoke } from "@tauri-apps/api";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appDir } from "@tauri-apps/api/path";
import React, { useContext, useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react";
import { HexToRGB, RGBToHex } from "../Theme";
import { ConvertJSONToINote, FontStyle, GenerateID, GetNotebooks, INote, INotebook } from "../Util";
import ToolbarButton from "./Components/ToolbarButton";
import { NotebooksContext } from "../App";
import useComponentVisible from "../useComponentVisible";
import logo from '../res/darkwrite_icon.svg'
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
/**
 * Get an INote from ID
 */
let getNote: (id: string) => INote;

/**
 * Update an existing note, or create the note if it doesn't have an ID assigned.
 */
let updateNote: (note: INote) => void;
let getNotebook: () => string;
let showEditor: (noteID: string) => void;
let setNotebookFilter: (notebookID: string) => void;
function NoteEditor() {
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
    left-[38rem] bottom-2 rounded-2xl flex flex-col backdrop-blur-md"
        style={{ display: isVisible ? "flex" : "none", backgroundColor: 
        note.background ? `rgb(${HexToRGB(note.background)?.r} ${HexToRGB(note.background)?.g} ${HexToRGB(note.background)?.b} / 1)` : 'rgba(var(--background-secondary) / 0.5)'}}>
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




function NotesPanel() {
    const { notebooks, setNotebooks }: any = useContext(NotebooksContext);
    function Note(props: any) {
        let newNotebookRef: any = useRef(null);
        let newNotebookContainerRef: any = useRef(null);
        const { ref, isComponentVisible, setIsComponentVisible }: any = useComponentVisible(false);
        const getFont = () => {
            switch (props.font) {
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
        const moveToNewNotebook = () => {
            let currentNotebooks: any = [...notebooks];
            let id = GenerateID();
            let newNotebook = { id: id, name: newNotebookRef.current.value } as INotebook;
            currentNotebooks.push(newNotebook);
            setNotebooks(currentNotebooks);
            showEditor("-1");
            updateNote({
                title: props.title, background: props.background,
                foreground: props.foreground,
                content: props.content, font: props.font,
                customFontFamily: props.customFont,
                notebookID: id,
                id: props.id
            } as INote)
            //writeTextFile("notebooks.json",JSON.stringify({"notebooks":notebooks}),{dir:BaseDirectory.App});
        }
        const moveToNotebook = (id: string) => {
            showEditor("-1");
            updateNote({
                title: props.title, background: props.background,
                foreground: props.foreground,
                content: props.content, font: props.font,
                customFontFamily: props.customFont,
                notebookID: id,
                id: props.id
            } as INote)
        }
        useEffect(()=>{
            if(props.isFilteredOut) props.innerRef.current?.style.setProperty("display","none");
        },[]);
        return <div ref={props.innerRef} {...props.draggableProps} onClick={props.onClick} {...props.dragHandleProps} className={"transition-all relative note select-none cursor-default duration-200 m-2 block rounded-2xl w-64"}>
            {props.isFilteredOut ? <></> : <div style={{
                background: props.background,
                color: props.foreground,
                
            }}
            className="rounded-2xl note-shadow  p-2 h-12 flex items-center">
                <div className="">
                    <h1 className={"text-2xl truncate " + getFont()} style={{fontFamily: props.font === FontStyle.Custom ? props.customFont : ""}}>{props.title}</h1>
                </div>
                <div className="h-10 z-10 absolute bottom-0 p-1 note-actions-bar right-0 left-0 justify-end rounded-b-2xl flex items-center">
                    <div onClick={(e) => {
                        e.stopPropagation();
                        setIsComponentVisible(true);
                    }} className="hover:bg-secondary/20 cursor-pointer h-8 w-8 rounded-[12px] flex items-center justify-center">
                        <i className="bi-journal-bookmark-fill"></i>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); showEditor("-1");deleteNote(props.id) }} className="hover:bg-secondary/20 cursor-pointer h-8 w-8 rounded-[12px] flex items-center justify-center">
                        <i className="bi-trash text-red-300"></i>
                    </div>
                </div>
                <div onClick={(e)=>{e.stopPropagation();}} ref={ref} style={{ visibility: isComponentVisible ? "visible" : "hidden" }} tabIndex={0} className="h-36 text-default z-50 absolute top-14 justify-center right-2 bg-secondary flex-col drop-shadow-lg shadow-black cursor-default left-14 rounded-2xl flex">
                    <span className="p-2">Move to notebook</span>
                    <div className="h-32 rounded-b-2xl overflow-y-auto">
                        <div onClick={() => {
                            newNotebookContainerRef.current.style = { display: "flex" }
                        }} className="p-2 hover:bg-primary outline-primary outline-1 transition-colors"><i className="bi-plus-lg"></i> New Notebook</div>
                        <div ref={newNotebookContainerRef} style={{ display: "none" }} className="flex">
                            <input ref={newNotebookRef} className="block w-40 p-1 bg-primary flex-[2]" placeholder="Notebook name"></input>
                            <div onClick={() => { moveToNewNotebook() }} className="bg-accent w-8 flex items-center justify-center cursor-pointer hover:brightness-110 transition-[filter]"><i className="bi-chevron-right text-white"></i></div>
                        </div>

                        {notebooks.map((nb: any) => <div onClick={() => { moveToNotebook(nb.id) }} className="p-2 hover:bg-primary outline-primary outline-1 transition-colors">{nb.name}</div>)}
                    </div>
                </div>
            </div>}
        </div>
    }
    const [notes, setNotes] = useState<INote[]>([]);
    const [notebook, setNotebook] = useState("0");
    const isFirstRender = useRef(true);

    setNotebookFilter = (notebookID: string) => {
        setNotebook(notebookID);
    };
    getNotebook = () => { return notebook; };
    getNote = (id: string) => {
        for (let n of notes) {
            if (n.id === id) return n;
        }
        return { id: id, title: "New Note", content: "", background: "#393939", foreground: "#ffffff", font: FontStyle.Sans, notebookID: notebook } as INote;
    }
    function deleteNote(id: string) {
        let currentNotes = [...notes];
        for (let i in notes) {
            if (notes[i].id === id) {
                currentNotes.splice(parseInt(i), 1);
            }
        }
        setNotes(currentNotes);
    }
    async function LoadNotes() {
        console.log("[INFO] Loading notes")
        setNotebooks(await GetNotebooks());
        let APPDIR = await appDir();
        if (!await invoke("path_exists", { targetPath: APPDIR + "notes.json" })) {
            writeTextFile(APPDIR + "notes.json", `{"notes":[]}`);
        }
        let notesFile = await readTextFile(APPDIR + "notes.json");
        let notesJSON = JSON.parse(notesFile);
        let _notes = ConvertJSONToINote(notesJSON.notes);
        setNotes(_notes);
    }
    updateNote = (x: INote) => {
        console.log(`Updating note: ${x.id}`)
        let done = false;
        for (let i in notes) {
            if (x.id === notes[i].id) {
                let currentNotes = Array.from(notes);
                currentNotes[i] = x;
                setNotes(currentNotes);
                done = true;
                return;
            }
        }
        if (done === false) {
            let currentNotes = Array.from(notes);
            currentNotes.push(x);
            setNotes(currentNotes);
        }

    };
    async function SaveNotes() {
        console.log("[INFO] Saving notes");
        await writeTextFile("notes.json", JSON.stringify({ "notes": notes }), { dir: BaseDirectory.App });
    }
    useEffect(() => {

        LoadNotes();
    }, [])
    useLayoutEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        console.log("saving notes")
        SaveNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notes]);
    return <div id="NotesPanel"
        className={"notes_div bg-secondary/50 backdrop-blur-md fixed overflow-y-scroll w-[17rem] top-16 bottom-2 transition-all rounded-2xl left-80"}>
        <DragDropContext onDragEnd={(result: any) => {
            if (!result.destination) return;
            console.log("reordering")
            const items = Array.from(notes);
            const [reordered] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reordered);
            setNotes(items);
            SaveNotes();
        }}>
            <Droppable droppableId="notesDrop">
                {(provided) => {
                    return <div ref={provided.innerRef} {...provided.droppableProps}>
                        {notes.map((item, index) => {
                            return <Draggable draggableId={item.id.toString()} key={item.id.toString()} index={index}>
                                {(_provided) => {
                                    return <Note onClick={() => { showEditor(item.id) }} id={item.id}
                                        background={item.background}
                                        foreground={item.foreground}
                                        content={item.content}
                                        font={item.font}
                                        customFont={item.customFontFamily}
                                        title={item.title}
                                        innerRef={_provided.innerRef}
                                        draggableProps={_provided.draggableProps}
                                        dragHandleProps={_provided.dragHandleProps}
                                        isFilteredOut={item.notebookID!==notebook}></Note>
                                }}
                            </Draggable>
                        })}
                        {provided.placeholder}
                    </div>
                }}
            </Droppable>
        </DragDropContext>
        
    </div>
}

export { showEditor, NotesPanel, getNotebook, setNotebookFilter,NoteEditor }
