import { type DragEvent, useCallback, useState } from "react";
import { beginDrag, DragType } from "@/features/dnd/datatransfer";
import { useAppStore } from "@/features/store/hooks";
import { canMoveNoteInto } from "../store/move-note-validator";
import { moveNote, reorderFavorite, reorderNote } from "../store/note.thunk";
import { getMovingNote, selectAllNotesAsMap } from "../store/note-selectors";
import type { NoteTreeItem } from "../store/notes-ui-selectors";

export enum DropPosition {
  Top = "top",
  Bottom = "bottom",
  Center = "center",
}

const EDGE_HEIGHT = 6;

export function computeDropPosition(elementRect: DOMRect, mouseY: number) {
  const { height, top } = elementRect;

  if (mouseY <= top + EDGE_HEIGHT) return DropPosition.Top;
  if (mouseY >= top + height - EDGE_HEIGHT) return DropPosition.Bottom;
  return DropPosition.Center;
}

export function useNoteItemDnD<T extends HTMLElement = HTMLElement>(
  item: NoteTreeItem,
) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { id } = item;
  const store = useAppStore();
  const [position, setPosition] = useState<DropPosition | null>(null);

  const onDrag = useCallback(
    (event: DragEvent<T>) => {
      beginDrag({ type: DragType.NOTE, noteId: id }, event, "move");
    },
    [id],
  );

  const onDragEnter = useCallback((e: DragEvent<T>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const onDragOver = useCallback((e: DragEvent<T>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
    // Measure the row, not the child under the cursor.
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition(computeDropPosition(rect, e.clientY));
  }, []);

  const endDragOver = useCallback(() => {
    setPosition(null);
    setIsDraggingOver(false);
  }, []);

  const onDragLeave = useCallback(
    (e: DragEvent<T>) => {
      // A child crossing retargets the leave to the row; ignore it.
      const related = e.relatedTarget as Node | null;
      if (related && e.currentTarget.contains(related)) return;
      e.preventDefault();
      e.stopPropagation();
      endDragOver();
    },
    [endDragOver],
  );

  const onDrop = (e: DragEvent<T>) => {
    e.preventDefault();
    e.stopPropagation();
    endDragOver();
    if (!position) return;
    const note = getMovingNote(e, store.getState());
    if (!note) return;
    const notes = selectAllNotesAsMap(store.getState());

    if (position === DropPosition.Center) {
      if (note.id === id || !canMoveNoteInto(note.id, id, notes)) return;
      store.dispatch(moveNote(note.id, id, "end"));
      return;
    }

    const placement = position === DropPosition.Top ? "above" : "below";

    if (item.type === "favorite" && item.depth === 0) {
      store.dispatch(reorderFavorite(note.id, id, placement));
      return;
    }

    store.dispatch(reorderNote(note.id, id, placement));
  };

  return {
    isDraggingOver,
    position,
    endDragOver,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrag,
    onDrop,
  };
}
