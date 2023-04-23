import { invoke } from "@tauri-apps/api";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import React, { useContext, useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react";
import { ConvertJSONToINote, FontStyle, GenerateID, GetNotebooks, INote, INotebook, NoteFormatting, NoteHeader } from "../Util";
import ToolbarButton from "./Components/ToolbarButton";
import { NotebooksContext } from "../App";
import useComponentVisible from "../useComponentVisible";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { showEditor } from "./NoteEditor";
import { NoteItem } from "./Components/NoteItem";
/**
 * Get an INote from ID
 */
let getNote: (id: string) => INote;

/**
 * Update an existing note, or create the note if it doesn't have an ID assigned.
 */
let updateNote: (note: INote) => void;
let getNotebook: () => string;

let setNotebookFilter: (notebookID: string) => void;




function NotesPanel() {
    const { notebooks, setNotebooks }: any = useContext(NotebooksContext);
    
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
        let APPDIR = await appConfigDir();
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
        className={"notes_div bg-secondary/80 overflow-x-hidden mr-2 flex-shrink-0 backdrop-blur-md h-full overflow-y-scroll w-[17rem] p-2 transition-all flex-col rounded-2xl"}>
       <div className="absolute w-16 h-16 left-[-30px] top-[-30px] bg-black"></div>
       <NoteItem header={{id: "5327459834706", title: "RJKELGBNLKJERG", formatting: {background: "#ffffff", foreground: "#000000", font :"SpaceMono Nerd Font"} as NoteFormatting, notebookID: "245346"} as NoteHeader}></NoteItem>
    </div>
}
 
export { showEditor, NotesPanel, getNotebook, setNotebookFilter,updateNote,getNote }
