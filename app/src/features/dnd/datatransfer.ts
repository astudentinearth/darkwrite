import JSONUtil from "@/common/json-util";
import { DragEvent } from "react";

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
  event: DragEvent<HTMLElement>,
  effect?: DataTransfer["effectAllowed"],
) {
  event.stopPropagation();
  event.dataTransfer.setData(DRAG_DATA_TYPE, JSON.stringify(data));
  if (effect) event.dataTransfer.effectAllowed = effect;
}

export function isDragging(event: DragEvent<HTMLElement>) {
  return event.dataTransfer.types.includes(DRAG_DATA_TYPE);
}

export function parseDragData(event: DragEvent<HTMLElement>) {
  const dataString = event.dataTransfer.getData(DRAG_DATA_TYPE);
  const dataOptional = JSONUtil.tryParse(dataString);
  if (dataOptional.error) return null;
  const data = dataOptional.result;
  if (!("type" in data) || typeof data.type !== "string") return null;
  else return data as IDragData;
}

export function extractDragDataType(event: DragEvent<HTMLElement>) {
  const data = parseDragData(event);
  if (!data) return null;
  return data.type as DragType;
}

export function extractNoteDragData(event: DragEvent<HTMLElement>) {
  const data = parseDragData(event);
  if (!data) return null;
  if (data.type !== DragType.NOTE) return null;
  return data;
}
