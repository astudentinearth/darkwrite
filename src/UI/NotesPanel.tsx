import { invoke } from "@tauri-apps/api";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NotebooksContext } from "../App";
import { ConvertJSONToINote, FontStyle, GetNotebooks, INote, NoteFormatting, NoteHeader } from "../Util";
import { NoteItem } from "./Components/NoteItem";
import { showEditor } from "./NoteEditor";
import React from "react";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {setNotebooks }: any = useContext(NotebooksContext);
    
    const [notes, setNotes] = useState<INote[]>([]);
    const [notebook, setNotebook] = useState("0");
    const isFirstRender = useRef(true);

    setNotebookFilter = (notebookID: string) => {
        setNotebook(notebookID);
    };
    getNotebook = () => { return notebook; };
    getNote = (id: string) => {
        for (const n of notes) {
            if (n.id === id) return n;
        }
        return { id: id, title: "New Note", content: "", background: "#393939", foreground: "#ffffff", font: FontStyle.Sans, notebookID: notebook } as INote;
    }
    async function LoadNotes() {
        console.log("[INFO] Loading notes")
        setNotebooks(await GetNotebooks());
        const APPDIR = await appConfigDir();
        if (!await invoke("path_exists", { targetPath: APPDIR + "notes.json" })) {
            writeTextFile(APPDIR + "notes.json", `{"notes":[]}`);
        }
        const notesFile = await readTextFile(APPDIR + "notes.json");
        const notesJSON = JSON.parse(notesFile);
        const _notes = ConvertJSONToINote(notesJSON.notes);
        setNotes(_notes);
    }
    updateNote = (x: INote) => {
        console.log(`Updating note: ${x.id}`)
        let done = false;
        for (const i in notes) {
            if (x.id === notes[i].id) {
                const currentNotes = Array.from(notes);
                currentNotes[i] = x;
                setNotes(currentNotes);
                done = true;
                return;
            }
        }
        if (done === false) {
            const currentNotes = Array.from(notes);
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
    }, [notes]);
    return <div id="NotesPanel"
        className={"notes_div bg-secondary/80 gap-1 mr-2 relative flex-shrink-0 backdrop-blur-md h-full overflow-y-scroll w-[17rem] p-2 transition-all flex-col rounded-2xl"}>
       <div className="h-8 rounded-lg mb-2 flex items-center">
        <select className="select1">
            <option>Alphabetical</option>
            <option>Last modified</option>
            <option>Newest first</option>
            <option>Oldest first</option>
        </select>
       </div>
       <NoteItem header={{id: "5327459834706", title: "RJKELGBNLKJERG", formatting: {background: "#ffffff", foreground: "#000000", font :"SpaceMono Nerd Font"} as NoteFormatting, notebookID: "245346"} as NoteHeader}></NoteItem>
    </div>
}

export { showEditor, NotesPanel, getNotebook, setNotebookFilter, updateNote, getNote };

