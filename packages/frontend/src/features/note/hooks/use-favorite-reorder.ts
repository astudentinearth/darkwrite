import { useDragState } from "@/features/dnd/use-drag-state";
import { useAppDispatch, useAppStore } from "@/features/store/hooks";
import { favoritesApi } from "../store/favorites-api";
import { getMovingNote } from "../store/move-note";

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

    try {
      dispatch(
        favoritesApi.endpoints.favorite.initiate({
          noteId: note.id,
          aboveNoteId: aboveId,
        }),
      );
    } catch (error) {
      console.error("Error favoriting note:", error);
    }
  };

  return {
    ...dragState,
    onDrop,
  };
}
