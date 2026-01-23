import { useAppSelector } from "@/features/store/hooks";
import { selectNoteById } from "../store/note-selectors";
import { useCallback, useState } from "react";
import {
  beginDrag,
  DragType,
  extractNoteDragData,
} from "@/features/dnd/datatransfer";

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
      console.log("Dropped note", data.noteId, "on note", id);
    },
    [id],
  );

  return { onDrag, onDragEnter, onDragLeave, isDragging, onDrop, onDragOver };
}
