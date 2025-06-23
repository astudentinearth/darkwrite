
export interface CreateNoteDTO {
  title: string;
  parentID?: string; 
  icon?: string; 
  databaseId?: string;
  workspaceId: string;
}

export interface UpdateNoteDTO {
  title?: string;
  parentID?: string; 
  icon?: string; 
  databaseId?: string;
  workspaceId?: string;
  propertyValues?: Record<string, string>;
  isFavorite?: boolean;
  isTrashed?: boolean;
}