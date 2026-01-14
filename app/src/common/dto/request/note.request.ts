export interface CreateNoteDTO {
  title: string;
  parentId: string | null;
  icon?: string | null;
  databaseId?: string | null;
  workspaceId: string;
  orderHint?: string;
  favoriteOrderHint: string;
}

export interface UpdateNoteDTO {
  title?: string;
  parentId?: string | null;
  icon?: string | null;
  databaseId?: string | null;
  workspaceId?: string | null;
  propertyValues?: Record<string, string> | null;
  isFavorite?: boolean;
  isTrashed?: boolean;
  orderHint?: string;
  favoriteOrderHint?: string;
}
