import { type DragEvent, useCallback } from "react";
import { beginDrag, DragType } from "@/features/dnd/datatransfer";
import { DropPosition, useProximityDnD } from "@/features/dnd/proximity-dnd";
import { useAppStore } from "@/features/store/hooks";
import { canMoveNoteInto } from "../store/move-note-validator";
import { moveNote, reorderFavorite, reorderNote } from "../store/note.thunk";
import { getMovingNote, selectAllNotesAsMap } from "../store/note-selectors";
import type { NoteTreeItem } from "../store/notes-ui-selectors";

export function useNoteItemDnD<T extends HTMLElement = HTMLElement>(
  item: NoteTreeItem,
) {
  const { id } = item;
  const store = useAppStore();

  const onDrag = useCallback(
    (event: DragEvent<T>) => {
      beginDrag({ type: DragType.NOTE, noteId: id }, event, "move");
    },
    [id],
  );

  const handleDrop = useCallback(
    (e: DragEvent<T>, position: DropPosition | null) => {
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
    },
    [id, item.type, item.depth],
  );

  const {
    onDrop,
    endDragOver,
    isDraggingOver,
    onDragOver,
    position,
    onDragEnter,
    onDragLeave,
  } = useProximityDnD<T>({
    dropEffect: "move",
    onDrop: handleDrop,
  });

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
