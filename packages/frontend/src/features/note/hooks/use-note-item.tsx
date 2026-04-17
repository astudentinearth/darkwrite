import { beginDrag, DragType } from "@/features/dnd/datatransfer";
import { useDragState } from "@/features/dnd/use-drag-state";
import { useAppSelector, useAppStore } from "@/features/store/hooks";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { matchPath } from "react-router-dom";
import {
  getMovingNote,
  useMoveBelowMutation,
  useMoveIntoMutation,
} from "../store/move-note";
import {
  canMoveNoteBelow,
  canMoveNoteInto,
} from "../store/move-note-validator";
import { selectAllNotesAsMap, selectNoteById } from "../store/note-selectors";
import {
  getCurrentRoutePath,
  NavigationEventBus,
} from "@/features/navigation/navigator";
import { useNoteActions } from "../store/note-actions";
import { useCurrentWorkspaceId } from "@/features/workspaces/hooks/use-workspace";

/**
 * Hook to get note data **within sidebar views.** Do NOT use this to
 * render arbitrary items. This expects the note to exist within cache.
 * @param id
 */
export function useNoteItem(id: string) {
  const note = useAppSelector((state) => selectNoteById(state, id));
  const [isActive, setIsActive] = useState(false);
  const { createNote } = useNoteActions();
  const workspaceId = useCurrentWorkspaceId();

  useEffect(() => {
    // get the path name at the moment of render to determine
    // initial active state. grab that state from react router
    // without subscribing to changes.
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

  return { note, isActive, createChild };
}

export function useNoteItemDrag(id: string) {
  const store = useAppStore();
  const {
    isDraggingOver,
    onDragEnter,
    onDragLeave,
    onDragOver,
    setIsDraggingOver,
  } = useDragState();
  const [trigger] = useMoveIntoMutation();

  type DragEvent = React.DragEvent<HTMLElement>;
  const onDrag = useCallback(
    (event: DragEvent) => {
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
        trigger({
          sourceNoteId: note.id,
          destinationNoteId: id,
          placement: "inside-end",
        });
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

export function useNoteDropZone(
  aboveOrParentId: string | null,
  mode: "below" | "into" = "below",
) {
  const {
    isDraggingOver,
    onDragEnter,
    onDragLeave,
    onDragOver,
    setIsDraggingOver,
  } = useDragState();

  const [moveBelow] = useMoveBelowMutation();
  const [moveInto] = useMoveIntoMutation();

  type DragEvent = React.DragEvent<HTMLElement>;
  const store = useAppStore();

  const handleDropForBelow = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (!aboveOrParentId) return;

      const movingNote = getMovingNote(e, store.getState());
      if (!movingNote) return;

      if (
        !canMoveNoteBelow(
          movingNote.id,
          aboveOrParentId,
          selectAllNotesAsMap(store.getState()),
        )
      )
        return;

      try {
        moveBelow({
          sourceNoteId: movingNote.id,
          aboveNoteId: aboveOrParentId,
        });
      } catch (error) {
        console.error("Failed to move note below:", error);
      }
    },
    [aboveOrParentId, moveBelow, setIsDraggingOver, store],
  );

  const handleDropInto = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      const movingNote = getMovingNote(e, store.getState());
      if (!movingNote) return;

      if (
        !canMoveNoteInto(
          movingNote.id,
          aboveOrParentId,
          selectAllNotesAsMap(store.getState()),
        )
      )
        return;

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
    [aboveOrParentId, moveInto, setIsDraggingOver, store],
  );

  return {
    onDragEnter,
    onDragLeave,
    isDragging: isDraggingOver,
    onDragOver,
    onDrop: mode === "below" ? handleDropForBelow : handleDropInto,
  };
}
