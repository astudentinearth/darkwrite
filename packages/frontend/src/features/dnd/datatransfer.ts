import { parseJson } from "@darkwrite/common";
import type { DragEvent as ReactDragEvent } from "react";
import { z } from "zod";

export enum DragType {
  Note = "application/darkwrite-drag-note",
  NoteProperty = "application/darkwrite-drag-note-property",
}

export interface NoteDragData {
  type: DragType.Note;
  noteId: string;
}

export interface NotePropertyDragData {
  type: DragType.NoteProperty;
  propertyName: string;
}

export type IDragData = NoteDragData | NotePropertyDragData;

type DragValidators = {
  [K in DragType]: z.ZodType<Extract<IDragData, { type: K }>>;
};

const dragValidators = {
  [DragType.Note]: z.object({
    type: z.literal(DragType.Note),
    noteId: z.string().nonempty(),
  }),
  [DragType.NoteProperty]: z.object({
    type: z.literal(DragType.NoteProperty),
    propertyName: z.string().nonempty(),
  }),
} satisfies DragValidators;

export function beginDrag(
  data: IDragData,
  event: ReactDragEvent<HTMLElement> | DragEvent,
  effect?: DataTransfer["effectAllowed"],
) {
  event.stopPropagation();
  if (!event.dataTransfer) return;
  event.dataTransfer.setData(data.type, JSON.stringify(data));
  if (effect) event.dataTransfer.effectAllowed = effect;
}

export function isDragging(
  event: ReactDragEvent<HTMLElement> | DragEvent,
  type: DragType,
) {
  return event.dataTransfer?.types.includes(type) ?? false;
}
export function extractDragDataType(
  event: ReactDragEvent<HTMLElement> | DragEvent,
): DragType | null {
  return (
    Object.values(DragType).find((type) =>
      event.dataTransfer?.types.includes(type),
    ) ?? null
  );
}

export function parseDragData(
  event: ReactDragEvent<HTMLElement> | DragEvent,
): IDragData | null {
  if (!event.dataTransfer) return null;
  const type = extractDragDataType(event);
  if (!type) return null;

  const dataString = event.dataTransfer.getData(type),
    parseResult = parseJson<IDragData>(dataString);
  if (parseResult.isErr()) return null;
  const zodResult = dragValidators[type].safeParse(parseResult.value);
  return zodResult.success ? zodResult.data : null;
}

export function extractNoteDragData(
  event: ReactDragEvent<HTMLElement> | DragEvent,
) {
  const data = parseDragData(event);
  if (!data) return null;
  if (data.type !== DragType.Note) return null;
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
