import { useDragState } from "@/features/dnd/use-drag-state";
import { useAppDispatch, useAppStore } from "@/features/store/hooks";
import { getCurrentWorkspaceId } from "@/features/workspaces/store/workspace.thunk";
import { reorderFavorite } from "../store/note.thunk";
import { getMovingNote, selectFavoriteIds } from "../store/note-selectors";

export function useFavoriteDropZone(aboveId: string | null) {
  const dragState = useDragState();
  const dispatch = useAppDispatch();
  const store = useAppStore();

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragState.setIsDraggingOver(false);

    const note = getMovingNote(e, store.getState());
    if (!note) return;

    if (aboveId) {
      dispatch(reorderFavorite(note.id, aboveId ?? undefined, "below"));
    } else {
      const anchor = selectFavoriteIds(
        store.getState(),
        getCurrentWorkspaceId(store.getState) ?? "",
      ).at(0);
      if (anchor) dispatch(reorderFavorite(note.id, anchor, "above"));
      else dispatch(reorderFavorite(note.id, aboveId ?? undefined, "below"));
    }
  };

  return {
    ...dragState,
    onDrop,
  };
}
