import type { NoteDTO } from "@/note";
import type { NoteContent } from "@/note-content";

export interface NotesResponseDTO {
  notes: Record<string, NoteDTO>;
}

export interface ParentTreeResponseDTO {
  parents: NoteDTO[];
}

export interface NoteResponseDTO {
  note: NoteDTO | null;
}

export interface NoteContentResponseDTO {
  document: NoteContent;
}
