import type { ParentId } from "@darkwrite/common";
import type { DragEvent } from "react";
import { extractNoteDragData } from "@/features/dnd/datatransfer";
import type { RootState } from "@/features/store/types";
import { selectNoteById } from "./note-selectors";
import { notesApi } from "./notes-api";

export type MoveNoteBelowArgs = {
  sourceNoteId: string;
  aboveNoteId: string;
};

/**
 * Moves the note into a tree level without specifying
 * an order relative to another note. This can also be used to
 * move notes to start or end within the same tree level.
 */
export type MoveNoteIntoArgs = {
  sourceNoteId: string;
  destinationNoteId: ParentId;
  placement: "inside-start" | "inside-end";
};

export function getMovingNote(e: DragEvent<HTMLElement>, state: RootState) {
  const sourceId = extractNoteDragData(e)?.noteId;
  if (!sourceId) return;
  const movingNote = selectNoteById(state, sourceId);
  return movingNote ?? null;
}

export const moveNoteApi = notesApi.injectEndpoints({
  endpoints: () => ({}),
  overrideExisting: false,
});
