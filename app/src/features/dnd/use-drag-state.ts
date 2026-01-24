import { useCallback, useState } from "react";

export function useDragState() {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  type DragEvent = React.DragEvent<HTMLElement>;
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  return {
    isDraggingOver,
    onDragOver,
    onDragEnter,
    onDragLeave,
    setIsDraggingOver,
  };
}
