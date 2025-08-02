
export enum DragType {
  NOTE = "note",
  FAVORITE = "favorite"
}

export interface NoteDragData {
  type: DragType.NOTE;
  noteId: string;
}

export type FavoriteDragData = NoteDragData;

export type IDragData = NoteDragData | FavoriteDragData;
