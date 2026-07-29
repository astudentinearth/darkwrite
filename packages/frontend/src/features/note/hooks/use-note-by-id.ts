import type { NoteDTO } from "@darkwrite/common";
import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";

interface NoteByIdResult {
  note: NoteDTO | null;
}

export function useNoteById(id: string | undefined): NoteByIdResult {
  const note = useAppSelector((state) => selectNoteById(state, id ?? ""));
  return {
    note: note || null,
  };
}
