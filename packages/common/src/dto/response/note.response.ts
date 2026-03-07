import { NoteContent } from "@/common/note-content";

export interface NoteDTO {
  id: string;
  title: string;
  icon?: string | null;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
  trashedAt?: string | null;
  orderHint: string;
  favoriteOrderHint: string;
  isFavorite?: boolean | null;
  isTrashed?: boolean | null;

  propertyValues?: Record<string, string> | null;

  userId?: string | null; // Owner of the note
  databaseId?: string | null; // ID of the database this note belongs to
  workspaceId: string; // ID of the workspace this note belongs to
}

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
