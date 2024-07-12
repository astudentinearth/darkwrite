import { Note } from "@renderer/lib/note";
import React, { Dispatch, SetStateAction } from "react";

export interface NotesContextType{
    notes: Note[],
    setNotes: Dispatch<SetStateAction<Note[]>>,
}

export const NotesContext = React.createContext<NotesContextType>({notes: [], setNotes: ()=>{}});