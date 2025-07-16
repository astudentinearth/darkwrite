import { UpdateNoteDTO } from "@darkwrite/common";
import {
  useUpdateNoteMutation
} from "@renderer/hooks/query";
import { cn } from "@renderer/lib/utils";
import { DragEvent, useState } from "react";
export function NoteDropZone({
  orderHint
}: {
  orderHint: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const updateMutation = useUpdateNoteMutation();
  const handleDrop = async (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const id = event.dataTransfer.getData("note_id");
    if(!id) return;
    setDragOver(false);
    const dto: UpdateNoteDTO = { orderHint }
    await updateMutation.mutateAsync({id, dto});
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDragEnd = () => {
    setDragOver(false);
  };
  return (
    <div
      className={cn(
        "h-[3px] w-full bg-transparent transition-colors rounded-md",
        dragOver && "bg-primary",
      )}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    ></div>
  );
}
