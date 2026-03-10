import { NoteDTO } from "@darkwrite/common";
import { isDescendant, ParentId } from "@darkwrite/common";

export function canMoveNoteInto(
  movingNoteId: string,
  destinationId: ParentId,
  notes: Record<string, NoteDTO>,
): boolean {
  if (movingNoteId === destinationId) return false;

  const isCircularMovement = isDescendant(destinationId, movingNoteId, notes);
  if (isCircularMovement) return false;

  return true;
}

export function canMoveNoteBelow(
  movingNoteId: string,
  aboveNoteId: string,
  notes: Record<string, NoteDTO>,
) {
  const aboveNote = notes[aboveNoteId];
  if (!aboveNote) return false;

  const isCircularMovement = isDescendant(
    aboveNote.parentId,
    movingNoteId,
    notes,
  );

  if (isCircularMovement) return false;

  return true;
}
