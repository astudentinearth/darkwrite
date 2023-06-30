import { useContext, useRef, useState } from "react";
import { NoteHeader, NoteInfo } from "../../Util";
import { Dialog } from "./Dialog";
import { Button, ButtonColor } from "./Button";
import { CreateNotebook, GetNotebookHeaders } from "../../backend/Notebook";
import { MoveNoteToNotebook } from "../../backend/Note";
import { NotifyNoteMovement } from "../NoteEditor";
import { RefreshNotesPanel } from "../NotesPanelMethods";
import { NotebooksContext } from "../../context/NotebooksContext";
import { ActiveNotebookContext } from "../../context/ActiveNotebookContext";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";

export let ShowMoveToNewNoteDialog: (note: NoteHeader | NoteInfo) => void;

export function MoveToNewNotebookDialog(props:any){
    const [note, setNote] = useState<NoteHeader | NoteInfo>({} as NoteHeader);
    const dialogRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const {setNotebooks} = useContext(NotebooksContext);
    const {notebookID, setNotebookID} = useContext(ActiveNotebookContext);
    const {locale} = useContext(LocaleContext);
    ShowMoveToNewNoteDialog=(n)=>{
        setNote(n);
        if(dialogRef.current==null) return;
        dialogRef.current.style.setProperty("display","flex");
    }
    return <Dialog reference={dialogRef}>
        <div className="flex flex-col gap-4 m-4">
            <h1 className="font-bold text-xl">{GetLocalizedResource("moveToNewNotebookDialogTitle",locale)}</h1>
            <div className="flex items-center">
                <span>{GetLocalizedResource("moveToNewNotebookDialogLabel",locale)}:</span>
                <input ref={nameRef} className="bg-widget ml-2 box-shadow-4-8-20 text-xl rounded-lg"></input>
            </div>
            <div className="flex items-center gap-2 justify-end">
                <Button onClick={()=>{
                    if(dialogRef==null) return;
                    dialogRef.current?.style.setProperty("display","none")
                }} width={120} icon="bi-x-lg" textContent={GetLocalizedResource("buttonCancel",locale)}></Button>
                <Button onClick={async ()=>{
                    if(nameRef.current==null) return;
                    if(nameRef.current.value.trim()=="" || nameRef.current.value==null) return;
                    const id = await CreateNotebook(nameRef.current.value);
                    await MoveNoteToNotebook(note, id);
                    NotifyNoteMovement(note);
                    RefreshNotesPanel();
                    if(dialogRef==null) return;
                    dialogRef.current?.style.setProperty("display","none")
                    const notebooks = await GetNotebookHeaders();
                    const active = notebookID;
                    setNotebooks(notebooks);
                    setNotebookID(active);
                }} width={120} icon="bi-journal-check" color={ButtonColor.Accent} textContent={GetLocalizedResource("buttonOK",locale)}></Button>
            </div>
        </div>
    </Dialog>
}

