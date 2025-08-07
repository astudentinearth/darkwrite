import { DragEvent, useState } from "react";
import {
  beginDrag,
  DragType,
  extractNoteDragData,
  NoteDragData,
} from "../dnd/datatransfer";
import { NoteDTO } from "@/common/dto";
import { useUpdateNote } from "@/query/use-update-note";

export function useNoteItemDrag(
  note: NoteDTO,
  finalOrderHint: string,
) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { update } = useUpdateNote();
  const onDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const onDragOver = (e: DragEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const onDragStart = (e: DragEvent<HTMLElement>) => {
    e.stopPropagation();
    const data: NoteDragData = {
      type: DragType.NOTE,
      noteId: note.id,
    };
    beginDrag(data, e, "move");
  };

  const onDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    const data = extractNoteDragData(e);
    if (data == null) return setIsDraggingOver(false);
    update({
      id: data.noteId,
      dto: { parentId: note.id, orderHint: finalOrderHint },
    });
    setIsDraggingOver(false);
  };

  const dragProps = {
    draggable: true,
    tabIndex: 0,
    onDragLeave,
    onDragOver,
    dragEnd: () => setIsDraggingOver(false),
    onDragStart,
    onDrop
  };

  return {dragProps, isDraggingOver}
}
