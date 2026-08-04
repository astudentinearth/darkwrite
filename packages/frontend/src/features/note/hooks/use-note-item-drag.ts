import { type DragEvent, MouseEvent, useCallback, useState } from "react";
import { beginDrag, DragType } from "@/features/dnd/datatransfer";
import { useDragState } from "@/features/dnd/use-drag-state";
import { useAppDispatch, useAppStore } from "@/features/store/hooks";
import { canMoveNoteInto } from "../store/move-note-validator";
import { moveNote, reorderFavorite, reorderNote } from "../store/note.thunk";
import { getMovingNote, selectAllNotesAsMap } from "../store/note-selectors";
import type { NoteTreeItem } from "../store/notes-ui-selectors";

export enum DropPosition {
  Top = "top",
  Bottom = "bottom",
  Center = "center",
}

const EDGE_HEIGHT = 4;

export function computeDropPosition(elementRect: DOMRect, mouseY: number) {
  const { height, top } = elementRect;
  console.log(`height: ${height} | top: ${top} | mouseY: ${mouseY}`);

  if (mouseY <= top + EDGE_HEIGHT) return DropPosition.Top;
  if (mouseY >= top + height - EDGE_HEIGHT) return DropPosition.Bottom;
  return DropPosition.Center;
}

export function useNoteItemDnD<T extends HTMLElement = HTMLElement>(
  item: NoteTreeItem,
) {
  const {
    isDraggingOver,
    setIsDraggingOver,
    onDragOver: _dragOver,
    onDragEnter,
    onDragLeave,
  } = useDragState();
  const { id } = item;
  const store = useAppStore();
  const [position, setPosition] = useState<DropPosition | null>(null);
  const onDrag = useCallback(
    (event: DragEvent<T>) => {
      beginDrag({ type: DragType.NOTE, noteId: id }, event, "move");
    },
    [id],
  );
  const onDragOver = (e: DragEvent<T>) => {
    _dragOver(e);
    if (!isDraggingOver) return;

    e.preventDefault();
    e.stopPropagation();

    const element = e.target as T;
    const rect = element.getBoundingClientRect();
    const dropPos = computeDropPosition(rect, e.clientY);
    setPosition(dropPos);
  };

  const endDragOver = () => {
    setPosition(null);
    setIsDraggingOver(false);
  };

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
