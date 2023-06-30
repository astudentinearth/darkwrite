import {
    DndContext,
    DragEndEvent,
    closestCenter,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { NoteHeader } from "../Util";
import { GetNoteHeaders, GetNoteInfoFromHeader, SaveNote } from "../backend/Note";
import { GetLocalizedResource, LocaleContext } from "../localization/LocaleContext";
import { ActiveNotebookContext } from "../data/ActiveNotebookContext";
import { NoteItem } from "./Components/NoteItem";
import { NotifyPinChange } from "./NoteEditor";
import { NotesPanelMethods, SetNotesPanelMethods } from "./NotesPanelMethods";
import { TasksPointerSensor } from "./TasksPointerSensor";
import { SortNotes, SortingMethod } from "./Utils/NoteList";

function NotesPanel() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.ALPHABETICAL);
    const [notes, setNotes] = useState<NoteHeader[]>([]);
    const [pinnedNotes, setPinnedNotes] = useState<NoteHeader[]>([]);
    const {notebookID} = useContext(ActiveNotebookContext);
    const {locale} = useContext(LocaleContext);
    async function Load(){
            const headers:NoteHeader[] = await GetNoteHeaders(notebookID);
            setNotes(headers);
    }
    useEffect(() => {
        if(notebookID==="0") return;
        Load();
        return;
    }, [notebookID])
    useEffect(()=>{
        const pinned = notes.filter((n)=>(n.pinned===true && n.pinIndex!=null)).sort((a,b)=>((a.pinIndex ?? 0) - (b.pinIndex ?? 0)));
        setPinnedNotes(pinned);
    }, [notes])
    const methods:NotesPanelMethods = {
        NotifyNoteModification: (note)=>{
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
        },
        RefreshNotesPanel: ()=>{
        Load();
        },
        PinNote: (n)=>{
            const notes_cpy = [...notes];
            for (const x of notes_cpy){
                if(x.id===n.id){ 
                    x.pinned=true;
                    x.pinIndex=pinnedNotes.length;
                    savepin(x);
                }
            }
            setNotes(notes_cpy);
            NotifyPinChange(n);
        },
        UnpinNote: (n)=>{
            const notes_cpy = [...notes];
            for (const x of notes_cpy){
                if(x.id===n.id){ 
                    x.pinned=false;
                    x.pinIndex=undefined;
                    savepin(x);
                }
            }
            setNotes(notes_cpy);
            NotifyPinChange(n);
        }
    }
    
    SetNotesPanelMethods(methods);
    
    const savepin = async (p: NoteHeader)=>{
        let inf = await GetNoteInfoFromHeader(p);
        inf = {...p, content: inf.content};
        await SaveNote(inf);
    };

    const renderpins = useCallback(()=>{
        const items = pinnedNotes.map((n)=>{
            if(n.pinned==false || n.pinned == null) {console.log("not pinned"); return <></>;}
            return <NoteItem key={n.id} header={n}></NoteItem>
        }); 
        return items;
    },[pinnedNotes,notes])
    
    const sensors = useSensors(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        useSensor(TasksPointerSensor)
    );
    
    const handlePinMove = (event:DragEndEvent)=>{
        const {active, over} = event;
        console.log(active)
        console.log(over)
        if(!over) return;
        if (active.id!==over.id){
            const oldIndex = pinnedNotes.map((e)=>{return e.id}).indexOf(active.id.toString());
            const newIndex = pinnedNotes.map((e)=>{return e.id}).indexOf(over.id.toString());
            const newOrder = arrayMove(pinnedNotes,oldIndex,newIndex);
            const final: NoteHeader[] = [];
            console.log(newOrder);
            for (let i=0;i<newOrder.length;i++){
                newOrder[i].pinIndex = i;
                final.push(newOrder[i]);
            }
            console.log(final);
            setPinnedNotes(final);
            for (const p of pinnedNotes){
                savepin(p);
            }
        }   
        
        return
    }

    return <div id="NotesPanel"
        className={"notes_div bg-secondary/80 mr-2 relative overflow-x-hidden flex-shrink-0 backdrop-blur-md h-full overflow-y-scroll w-[17rem] transition-all flex-col rounded-2xl"}>
       <div className="h-8 rounded-lg m-2 flex items-center gap-2 flex-row">
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
       
       <div className="bg-primary/75 rounded-xl m-1">
            <DndContext modifiers={[restrictToVerticalAxis]} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePinMove}>
                <SortableContext items={pinnedNotes} strategy={verticalListSortingStrategy}>
                    <div className="py-1" style={{display: pinnedNotes.length===0 ? "none" : "block"}}>
                        {renderpins()}
                    </div>
                </SortableContext>
            </DndContext>
       </div>
       <div className="m-1">
        {SortNotes(sortingMethod, notes).map((n)=>{ if(n.pinned===true) return;
            return <NoteItem key={n.id} header={n}></NoteItem>
        })}
       </div>
    </div>
}


export { NotesPanel };

