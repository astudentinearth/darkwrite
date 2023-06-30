import { NoteHeader, NoteInfo } from "../Util";


export let NotifyNoteModification: (note: NoteInfo) => void;
export let RefreshNotesPanel: () => void;
export let PinNote: (n: NoteHeader) => void;
export let UnpinNote: (n: NoteHeader) => void;

export interface NotesPanelMethods{
    NotifyNoteModification: (note: NoteInfo) => void;
    RefreshNotesPanel: () => void;
    PinNote: (n: NoteHeader) => void;
    UnpinNote: (n: NoteHeader) => void;
}

export function SetNotesPanelMethods(m: NotesPanelMethods){
    NotifyNoteModification = m.NotifyNoteModification;
    RefreshNotesPanel = m.RefreshNotesPanel;
    PinNote = m.PinNote;
    UnpinNote = m.UnpinNote;
}