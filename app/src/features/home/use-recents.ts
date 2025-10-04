import { NoteDTO } from "@/common/dto";
import { byUpdateTime, notTrashed } from "@/common/note-filters";
import { useNotes } from "@/query/use-notes";
import { useMemo } from "react";

export default function useRecents() {
  const notes = useNotes().notes;
  const recents = useMemo(()=>{
    if(!notes) return [] as NoteDTO[];
    const noteList = Object.values(notes).filter(notTrashed).toSorted(byUpdateTime("desc")).slice(0, 5);
    return noteList; 
  }, [notes]);
  return { recents };
}

