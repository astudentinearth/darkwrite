import { isDescendant } from "@/common/note";
import {
  beginDrag,
  DragType,
  extractNoteDragData,
} from "@/features/dnd/datatransfer";
import { useAppSelector } from "@/features/store/hooks";
import { RootState, store } from "@/features/store/redux";
import { useCallback, useState } from "react";
import { useMoveBelowMutation, useMoveIntoMutation } from "../store/move-note";
import { selectAllNotesAsMap, selectNoteById } from "../store/note-selectors";

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

      const isCircularMovement = isDescendant(id, data.noteId, notes);
      if (isCircularMovement) return;

      const note = selectNoteById(store.getState() as RootState, data.noteId);
      if (!note) return;
      if (note.parentId === id) return;

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

export function useNoteDropZone(
  aboveOrParentId: string | null,
  mode: "below" | "into" = "below",
) {
  const [isDragging, setIsDragging] = useState(false);

  const [moveBelow] = useMoveBelowMutation();
  const [moveInto] = useMoveIntoMutation();

  type DragEvent = React.DragEvent<HTMLElement>;
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

  const handleDropForBelow = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const sourceId = extractNoteDragData(e)?.noteId;
      if (!sourceId) return;

      setIsDragging(false);
      if (!aboveOrParentId) return;

      const movingNote = selectNoteById(
        store.getState() as RootState,
        sourceId,
      );
      if (!movingNote) return;

      const notes = selectAllNotesAsMap(store.getState() as RootState);

      const aboveNote = selectNoteById(
        store.getState() as RootState,
        aboveOrParentId,
      );

      const isCircularMovement = isDescendant(
        aboveNote.parentId,
        movingNote.id,
        notes,
      );

      if (isCircularMovement) return;

      try {
        moveBelow({ sourceNoteId: movingNote.id, aboveNoteId: aboveNote.id });
      } catch (error) {
        console.error("Failed to move note below:", error);
      }
    },
    [aboveOrParentId, moveBelow],
  );

  const handleDropInto = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const sourceId = extractNoteDragData(e)?.noteId;
      if (!sourceId) return;

      setIsDragging(false);

      const movingNote = selectNoteById(
        store.getState() as RootState,
        sourceId,
      );
      if (!movingNote) return;

      const notes = selectAllNotesAsMap(store.getState() as RootState);

      const isCircularMovement = isDescendant(
        aboveOrParentId,
        movingNote.id,
        notes,
      );
      if (isCircularMovement) return;
      if (movingNote.parentId === aboveOrParentId) return;
      try {
        moveInto({
          sourceNoteId: movingNote.id,
          destinationNoteId: aboveOrParentId,
          placement: "inside-start",
        });
      } catch (error) {
        console.error("Failed to move note into:", error);
      }
    },
    [aboveOrParentId, moveInto],
  );

  return {
    onDragEnter,
    onDragLeave,
    isDragging,
    onDragOver,
    onDrop: mode === "below" ? handleDropForBelow : handleDropInto,
  };
}
