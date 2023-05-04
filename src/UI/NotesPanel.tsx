import { ChangeEvent, useContext, useEffect, useState } from "react";
import { NoteHeader, NoteInfo } from "../Util";
import { GetNoteHeaders } from "../backend/Note";
import { GetLocalizedResource, LocaleContext } from "../localization/LocaleContext";
import { NoteItem } from "./Components/NoteItem";
import { SortNotes, SortingMethod } from "./Utils/NoteList";
import { ActiveNotebookContext } from "./ActiveNotebookContext";

export let NotifyNoteModification: (note: NoteInfo)=>void;
export let RefreshNotesPanel: ()=>void;

function NotesPanel() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.ALPHABETICAL);
    const [notes, setNotes] = useState<NoteHeader[]>([]);
    const {notebookID} = useContext(ActiveNotebookContext);
    const {locale} = useContext(LocaleContext);
    async function Load(){
            const headers:NoteHeader[] = await GetNoteHeaders(notebookID);
            console.table(headers);
            setNotes(headers);
    }
    useEffect(() => {
        if(notebookID==="0") return;
        Load();
        return;
    }, [notebookID])
    NotifyNoteModification = (note)=>{
        const items = [...notes];
        const ids = items.map((i)=>i.id);
        if(note.notebookID!==notebookID) return;
        if(!ids.includes(note.id)) {
            items.push(note);
            setNotes(items);
        }
        for (const i in items){
            if(items[i].id!==note.id) continue;
            items[i]=note;
            setNotes(items);
        }
    }
    RefreshNotesPanel=()=>{
        Load();
    }
    return <div id="NotesPanel"
        className={"notes_div bg-secondary/80 mr-2 relative overflow-x-hidden flex-shrink-0 backdrop-blur-md h-full overflow-y-scroll w-[17rem] p-2 transition-all flex-col rounded-2xl"}>
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
       {SortNotes(sortingMethod, notes).map((n)=>{
        return <NoteItem key={n.id} header={n}></NoteItem>
       })}
    </div>
}


export { NotesPanel };

