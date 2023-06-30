import { NoteHeader } from "../../Util";

export enum SortingMethod{
    ALPHABETICAL = "ALPHABETICAL",
    LASTMODIFIED = "LASTMODIFIED",
    NEWEST = "NEWEST", // Extract creation date from the ID
    OLDEST = "OLDEST"
}

export function SortNotes(method: SortingMethod, notes: NoteHeader[]){
    switch (method){
        case SortingMethod.ALPHABETICAL:{
            return notes.sort((a,b)=>{return ('' + a.title).localeCompare(b.title)})
        }
        case SortingMethod.LASTMODIFIED:{
            return notes.sort((a,b)=>((a.modificationTime ?? 0) < (b.modificationTime ?? 0)) ? 1 : -1)
        }
        case SortingMethod.NEWEST:{
            return notes.sort((a,b)=>((parseInt(a.id)) < (parseInt(b.id) ?? 0)) ? 1 : -1)
        }
        case SortingMethod.OLDEST:{
            return notes.sort((a,b)=>((parseInt(a.id)) > (parseInt(b.id) ?? 0)) ? 1 : -1)
        }
    }
}