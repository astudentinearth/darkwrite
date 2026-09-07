import { type DragEvent, useCallback, useState } from "react";
import { isDragging } from "./datatransfer";

export enum DropPosition {
  Top = "top",
  Bottom = "bottom",
  Center = "center",
}
export const positionToClassName: Record<DropPosition, string> = {
  [DropPosition.Top]: "dnd-top-edge",
  [DropPosition.Center]: "bg-primary/10",
  [DropPosition.Bottom]: "dnd-bottom-edge",
};

export type DropEffect = DataTransfer["dropEffect"];

export function computeDropPosition(
  elementRect: DOMRect,
  mouseY: number,
  edgeHeight = 6,
) {
  const { height, top } = elementRect;

  if (mouseY <= top + edgeHeight) return DropPosition.Top;
  if (mouseY >= top + height - edgeHeight) return DropPosition.Bottom;
  return DropPosition.Center;
}

export type ProximityDnDOptions<T extends HTMLElement> = {
  /**
   * Drop side effect to be called.
   * @param e the original event object
   */
  onDrop: (e: DragEvent<T>, position: DropPosition | null) => void;
  dropEffect: DropEffect;
  edgeHeight?: number;
};

export function useProximityDnD<T extends HTMLElement = HTMLElement>({
  onDrop,
  dropEffect,
  edgeHeight,
}: ProximityDnDOptions<T>) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [position, setPosition] = useState<DropPosition | null>(null);

  const onDragEnter = useCallback((e: DragEvent<T>) => {
    if (!isDragging(e)) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const onDragOver = useCallback(
    (e: DragEvent<T>) => {
      if (!isDragging(e)) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = dropEffect;
      setIsDraggingOver(true);
      // Measure the row, not the child under the cursor.
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition(computeDropPosition(rect, e.clientY, edgeHeight));
    },
    [dropEffect, edgeHeight],
  );

  const endDragOver = useCallback(() => {
    setPosition(null);
    setIsDraggingOver(false);
  }, []);

  const onDragLeave = useCallback(
    (e: DragEvent<T>) => {
      if (!isDragging(e)) return;
      const related = e.relatedTarget as Node | null;
      if (related && e.currentTarget.contains(related)) return;
      e.preventDefault();
      e.stopPropagation();
      endDragOver();
    },
    [endDragOver],
  );

  const _onDrop = useCallback(
    (e: DragEvent<T>) => {
      if (!isDragging(e)) return;
      e.preventDefault();
      e.stopPropagation();
      endDragOver();
      onDrop(e, position);
    },
    [onDrop, position, endDragOver],
  );

  return {
    onDragEnter,
    onDragOver,
    onDragLeave,
    endDragOver,
    isDraggingOver,
    position,
    onDrop: _onDrop,
  };
}
