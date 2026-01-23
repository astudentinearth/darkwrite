import { useAppSelector } from "@/features/store/hooks";
import {
  selectAllNotes,
  selectAllNotesAsMap,
  selectNoteById,
} from "../store/note-selectors";
import { useCallback, useState } from "react";
import {
  beginDrag,
  DragType,
  extractNoteDragData,
} from "@/features/dnd/datatransfer";
import { useMoveIntoMutation } from "../store/move-note";
import { isDescendant } from "@/common/note";
import { RootState, store } from "@/features/store/redux";

/**
 * Hook to get note data **within sidebar views.** Do NOT use this to
 * render arbitrary items. This expects the note to exist within cache.
 * @param id
 */
export function useNoteItem(id: string) {
  const note = useAppSelector((state) => selectNoteById(state, id));

  if (!note) return null;
  return note;
}

export function useNoteItemDrag(id: string) {
  const [isDragging, setIsDragging] = useState(false);
  const [trigger] = useMoveIntoMutation();
  type DragEvent = React.DragEvent<HTMLElement>;
  const onDrag = useCallback(
    (event: DragEvent) => {
      beginDrag({ type: DragType.NOTE, noteId: id }, event, "move");
    },
    [id],
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const data = extractNoteDragData(e);
      if (data == null) return setIsDragging(false);
      const notes = selectAllNotesAsMap(store.getState() as RootState);
      const canMove = !isDescendant(id, data.noteId, notes);
      if (!canMove) return;
      try {
        trigger({
          sourceNoteId: data.noteId,
          destinationNoteId: id,
          placement: "inside-end",
        });
      } catch (error) {
        console.error("Failed to move note:", error);
      }
    },
    [id, trigger],
  );

  return { onDrag, onDragEnter, onDragLeave, isDragging, onDrop, onDragOver };
}
