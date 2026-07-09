import type { DatabaseViewMeta, NoteDTO } from "@/note";
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

export interface CreateDatabaseResponse {
  database: NoteDTO;
  views: NoteDTO[];
  viewMetadata: DatabaseViewMeta[];
}

export interface CreateDatabaseViewResponse {
  note: NoteDTO;
  meta: DatabaseViewMeta;
}

export interface GetDatabaseViewResponse {
  note: NoteDTO;
  meta: DatabaseViewMeta;
}

export interface GetViewsOfResponse {
  notes: NoteDTO[];
  views: DatabaseViewMeta[];
}

export interface GetNotesInDatabaseResponse {
  notes: NoteDTO[];
}
