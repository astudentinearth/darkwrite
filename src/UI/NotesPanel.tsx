import { ChangeEvent, useContext, useEffect, useState } from "react";
import { INote,  NoteHeader } from "../Util";
import { GetNoteHeaders } from "../backend/Note";
import { GetLocalizedResource, LocaleContext } from "../localization/LocaleContext";
import { NoteItem } from "./Components/NoteItem";
import { showEditor } from "./NoteEditor";
import { SortNotes, SortingMethod } from "./Utils/NoteList";
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
    const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.ALPHABETICAL);
    const [notes, setNotes] = useState<NoteHeader[]>([]);
    const [notebook, setNotebook] = useState("168174330492789615250");
    const {locale} = useContext(LocaleContext);
    setNotebookFilter = (notebookID: string) => {
        setNotebook(notebookID);
    };
    useEffect(() => {
        async function Load(){
            const headers:NoteHeader[] = await GetNoteHeaders(notebook);
            console.table(headers);
            setNotes(headers);
        }
        Load();
        return;
    }, [])
    useEffect(()=>{
        setNotes(SortNotes(sortingMethod, notes));
    },[notes,sortingMethod])
    return <div id="NotesPanel"
        className={"notes_div bg-secondary/80 mr-2 relative flex-shrink-0 backdrop-blur-md h-full overflow-y-scroll w-[17rem] p-2 transition-all flex-col rounded-2xl"}>
       <div className="h-8 rounded-lg mb-2 flex items-center gap-2 flex-row">
        <select defaultValue={sortingMethod} onChange={(event: ChangeEvent)=>{
            if(event.target==null) return;
            const target = event.target as HTMLSelectElement;
            const method = SortingMethod[target.value];
            setSortingMethod(method);
        }} className="select1 bg-secondary">
            <option value={SortingMethod.ALPHABETICAL}>{GetLocalizedResource("alphabeticalSort",locale)}</option>
            <option value={SortingMethod.LASTMODIFIED}>{GetLocalizedResource("lastModifiedSort",locale)}</option>
            <option value={SortingMethod.NEWEST}>{GetLocalizedResource("newestFirstSort",locale)}</option>
            <option value={SortingMethod.OLDEST}>{GetLocalizedResource("oldestFirstSort",locale)}</option>
        </select>
       </div>
       {notes.map((n)=>{
        return <NoteItem key={n.id} header={n}></NoteItem>
       })}
    </div>
}


export { showEditor, NotesPanel, getNotebook, setNotebookFilter, updateNote, getNote };

