import { useDragState } from "@/features/dnd/use-drag-state";
import { useAppDispatch, useAppStore } from "@/features/store/hooks";
import { favoritesApi } from "../store/favorites-api";
import { reorderFavorite } from "../store/note.thunk";
import { getMovingNote } from "../store/note-selectors";

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

    dispatch(reorderFavorite(note.id, aboveId ?? undefined, "below"));
  };

  return {
    ...dragState,
    onDrop,
  };
}
