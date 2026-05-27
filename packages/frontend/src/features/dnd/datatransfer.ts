import { parseJson } from "@darkwrite/common";
import type { DragEvent as ReactDragEvent } from "react";

export const DRAG_DATA_TYPE = "application/darkwrite-drag-internal";

export enum DragType {
  NOTE = "note",
  FAVORITE = "favorite",
}

export interface NoteDragData {
  type: DragType.NOTE;
  noteId: string;
}

export type FavoriteDragData = NoteDragData;

export type IDragData = NoteDragData | FavoriteDragData;

export function beginDrag(
  data: IDragData,
  event: ReactDragEvent<HTMLElement> | DragEvent,
  effect?: DataTransfer["effectAllowed"],
) {
  event.stopPropagation();
  if (!event.dataTransfer) return;
  event.dataTransfer.setData(DRAG_DATA_TYPE, JSON.stringify(data));
  if (effect) event.dataTransfer.effectAllowed = effect;
}

export function isDragging(event: ReactDragEvent<HTMLElement> | DragEvent) {
  return event.dataTransfer?.types.includes(DRAG_DATA_TYPE) ?? false;
}

export function parseDragData(event: ReactDragEvent<HTMLElement> | DragEvent) {
  if (!event.dataTransfer) return null;
  const dataString = event.dataTransfer.getData(DRAG_DATA_TYPE);
  const parseResult = parseJson<IDragData>(dataString);
  if (parseResult.isErr()) return null;
  const data = parseResult.value;
  if (!("type" in data) || typeof data.type !== "string") return null;
  else return data as IDragData;
}

export function extractDragDataType(
  event: ReactDragEvent<HTMLElement> | DragEvent,
) {
  const data = parseDragData(event);
  if (!data) return null;
  return data.type as DragType;
}

export function extractNoteDragData(
  event: ReactDragEvent<HTMLElement> | DragEvent,
) {
  const data = parseDragData(event);
  if (!data) return null;
  if (data.type !== DragType.NOTE) return null;
  return data;
}

export function extractNoteIdFromDragData(
  event: ReactDragEvent<HTMLElement> | DragEvent,
) {
  const noteData = extractNoteDragData(event);
  if (!noteData) return null;
  if (!("noteId" in noteData) || typeof noteData.noteId !== "string")
    return null;
  return noteData.noteId;
}
