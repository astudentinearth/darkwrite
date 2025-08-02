import JSONUtil from "@/common/json-util";
import { useState, DragEvent } from "react";
import { DragType, NoteDragData } from "../dnd/datatransfer";
import { useUpdateNote } from "@/query/use-update-note";
import { cn } from "@/lib/utils";

export default function NoteDropZone({orderHint, parentId}: {orderHint: string, parentId: string | null}) {
  const { update } = useUpdateNote();
  const [dragOver, setDragOver] = useState(false);
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(
      event.dataTransfer.types.includes("application/darkwrite-drag-internal"),
    );
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    console.log("drop");
    event.preventDefault();
    const dataString = event.dataTransfer.getData(
      "application/darkwrite-drag-internal",
    );
    const dataOptional = JSONUtil.tryParse(dataString);
    console.log(dataString);
    if (dataOptional.error) {
      console.log("error", dataOptional.error);
      return setDragOver(false);
    }
    const data = dataOptional.result;
    if (
      !("type" in data) ||
      data.type !== DragType.NOTE ||
      !("noteId" in data) ||
      ((data as NoteDragData).noteId === parentId)
    ) {
      console.log("data broken", data);
      return setDragOver(false);
    }
    const { noteId } = data as NoteDragData;
    console.log(`update ${noteId} with parent: ${parentId}, rank: ${orderHint}`);
    update({
      id: noteId,
      dto: { parentId: parentId, orderHint: orderHint },
    });
    setDragOver(false);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={cn("w-full h-1", dragOver && "bg-primary/20")}>
  </div>
}