import { NoteDTO } from "@/common/dto";
import { isDescendant, ParentId } from "@/common/note";
import { selectAllNotesAsMap } from "./note-selectors";
import { store } from "@/features/store/redux";
import { RootState } from "@/features/store/types";

export function canMoveNoteInto(
  movingNoteId: string,
  destinationId: ParentId,
  notes?: Record<string, NoteDTO>,
): boolean {
  notes ??= selectAllNotesAsMap(store.getState() as RootState);

  if (movingNoteId === destinationId) return false;

  const isCircularMovement = isDescendant(destinationId, movingNoteId, notes);
  if (isCircularMovement) return false;

  return true;
}

export function canMoveNoteBelow(
  movingNoteId: string,
  aboveNoteId: string,
  notes?: Record<string, NoteDTO>,
) {
  notes ??= selectAllNotesAsMap(store.getState() as RootState);
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
