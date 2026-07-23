import { NoteType, type ParentId } from "@darkwrite/common";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { matchPath } from "react-router-dom";
import { beginDrag, DragType } from "@/features/dnd/datatransfer";
import { useDragState } from "@/features/dnd/use-drag-state";
import {
  getCurrentRoutePath,
  NavigationEventBus,
} from "@/features/navigation/navigator";
import { useAppStore } from "@/features/store/hooks";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";
import { getMovingNote, useMoveNoteMutation } from "../store/move-note";
import { canMoveNoteInto } from "../store/move-note-validator";
import { useNoteActions } from "../store/note-actions";
import { selectAllNotesAsMap } from "../store/note-selectors";
import { useNoteById } from "./use-note-by-id";

/**
 * Hook to get note data **within sidebar views.** Do NOT use this to
 * render arbitrary items. This expects the note to exist within cache.
 * @param id
 */
export function useNoteItem(id: string) {
  const { note } = useNoteById(id);
  const [isActive, setIsActive] = useState(false);
  const { createNote } = useNoteActions();
  const workspaceId = useCurrentWorkspaceId();
  const draggable = note?.type !== NoteType.DatabaseView;
  const acceptsDrop = note?.type !== NoteType.DatabaseView;
  const expandable = note?.type !== NoteType.DatabaseView;

  useEffect(() => {
    const path = getCurrentRoutePath();
    const match = matchPath("/page/:pageId", path);
    if (match?.params.pageId === id) {
      setIsActive(true);
    }
  }, [id]);

  useEffect(() => {
    const unsubscribe = NavigationEventBus.subscribe("note", ({ data }) => {
      if (data.noteId === id) setIsActive(true);
      else if (isActive) setIsActive(false);
    });
    return () => unsubscribe();
  }, [id, isActive]);

  const createChild = (e?: MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!workspaceId) return;
    createNote({ parentId: id, workspaceId, navigateAfter: true });
  };

  return { note, isActive, createChild, draggable, acceptsDrop, expandable };
}

export function useNoteItemDrag(id: ParentId) {
  const store = useAppStore();
  const {
    isDraggingOver,
    onDragEnter,
    onDragLeave,
    onDragOver,
    setIsDraggingOver,
  } = useDragState();
  const [trigger] = useMoveNoteMutation();

  type DragEvent = React.DragEvent<HTMLElement>;
  const onDrag = useCallback(
    (event: DragEvent) => {
      if (!id) return;
      beginDrag({ type: DragType.NOTE, noteId: id }, event, "move");
    },
    [id],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDraggingOver(false);
      const note = getMovingNote(e, store.getState());
      if (!note) return;

      if (!canMoveNoteInto(note.id, id, selectAllNotesAsMap(store.getState())))
        return;

      if (note.parentId === id) return;

      try {
        trigger({ sourceNoteId: note.id, parentId: id });
      } catch (error) {
        console.error("Failed to move note:", error);
      }
    },
    [id, trigger, setIsDraggingOver, store],
  );

  return {
    onDrag,
    onDragEnter,
    onDragLeave,
    isDragging: isDraggingOver,
    onDrop,
    onDragOver,
  };
}
