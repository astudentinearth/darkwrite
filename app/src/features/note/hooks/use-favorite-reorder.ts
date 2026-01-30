import { useDragState } from "@/features/dnd/use-drag-state";

export function useFavoriteDropZone(aboveId: string | null) {
  const dragState = useDragState();

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {};

  return {
    ...dragState,
    onDrop,
  };
}
