
export interface NoteDTO {
  id: string;
  title: string;
  icon?: string;
  parentId?: string;
  createdAt: Date;
  modifiedAt: Date;
  trashedAt?: Date;
  orderHint: string;
  favoriteOrderHint: string;
  isFavorite?: boolean;
  isTrashed?: boolean;

  propertyValues?: Record<string, string>;

  userId?: string; // Owner of the note
  databaseId?: string; // ID of the database this note belongs to
  workspaceId: string; // ID of the workspace this note belongs to
}

export interface NotesResponseDTO {
  notes: NoteDTO[];
}

export interface NoteResponseDTO {
  note: NoteDTO | null;
}