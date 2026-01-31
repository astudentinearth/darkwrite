import { useDragState } from "@/features/dnd/use-drag-state";
import { getMovingNote } from "../store/move-note";
import { useAppDispatch } from "@/features/store/hooks";
import { favoritesApi } from "../store/favorites-api";

export function useFavoriteDropZone(aboveId: string | null) {
  const dragState = useDragState();
  const dispatch = useAppDispatch();

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragState.setIsDraggingOver(false);

    const note = getMovingNote(e);
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
