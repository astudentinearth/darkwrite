import { cn } from "@/lib/utils";
import { useUpdateNote } from "@/query/use-update-note";
import { DragEvent, useState } from "react";
import { extractNoteDragData, isDragging } from "../dnd/datatransfer";
import { UpdateNoteDTO } from "@/common/dto";

export default function NoteDropZone({
  orderHint,
  parentId,
  orderingKey = "orderHint",
}: {
  orderHint: string;
  parentId?: string | null;
  orderingKey?: "orderHint" | "favoriteOrderHint";
}) {
  const { update } = useUpdateNote();
  const [dragOver, setDragOver] = useState(false);
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(isDragging(event));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const data = extractNoteDragData(event);
    if (data == null) return setDragOver(false);
    if (data.noteId === parentId) return setDragOver(false);
    const { noteId } = data;
    const dto: UpdateNoteDTO = { parentId: parentId, [orderingKey]: orderHint };
    if (orderingKey === "favoriteOrderHint") dto.isFavorite = true;
    update({
      id: noteId,
      dto,
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
