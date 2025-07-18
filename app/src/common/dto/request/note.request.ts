
export interface CreateNoteDTO {
  title: string;
  parentId?: string; 
  icon?: string; 
  databaseId?: string;
  workspaceId: string;
  orderHint: string;
  favoriteOrderHint: string;
}

export interface UpdateNoteDTO {
  title?: string;
  parentId?: string; 
  icon?: string; 
  databaseId?: string;
  workspaceId?: string;
  propertyValues?: Record<string, string>;
  isFavorite?: boolean;
  isTrashed?: boolean;
  orderHint?: string;
  favoriteOrderHint?: string;
}