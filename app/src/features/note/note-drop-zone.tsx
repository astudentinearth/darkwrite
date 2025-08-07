import { cn } from "@/lib/utils";
import { useUpdateNote } from "@/query/use-update-note";
import { DragEvent, useState } from "react";
import {
  extractNoteDragData,
  isDragging
} from "../dnd/datatransfer";

export default function NoteDropZone({
  orderHint,
  parentId,
  orderingKey = "orderHint"
}: {
  orderHint: string;
  parentId: string | null;
  orderingKey?: "orderHint" | "favoriteOrderHint"
}) {
  const { update } = useUpdateNote();
  const [dragOver, setDragOver] = useState(false);
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(isDragging(event));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    console.log("drop");
    event.preventDefault();
    const data = extractNoteDragData(event);
    if (data == null) return setDragOver(false);
    if (data.noteId === parentId) return setDragOver(false);
    const { noteId } = data;
    update({
      id: noteId,
      dto: { parentId: parentId, [orderingKey]: orderHint },
    });
    setDragOver(false);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn("w-full h-1", dragOver && "bg-primary/20")}
    ></div>
  );
}
