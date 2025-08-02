import { NoteDTO } from "@/common/dto";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, getNoteIcon } from "@/lib/utils";
import { useNotes } from "@/query/use-notes";
import { ChevronRight, Plus } from "lucide-react";
import { DragEvent, MouseEvent, useMemo, useState } from "react";
import NoteList from "./note-list";
import { LexoRank } from "lexorank";
import { useCreateNoteMutation } from "@/query/use-create-note";
import { DragType, NoteDragData } from "../dnd/datatransfer";
import JSONUtil from "@/common/json-util";
import { useUpdateNote } from "@/query/use-update-note";

export default function NoteItem({ note }: { note: NoteDTO }) {
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { notes } = useNotes();
  const { create } = useCreateNoteMutation();
  const { update } = useUpdateNote();

  const children =
    useMemo(
      () => notes?.filter((n) => n.parentId === note.id),
      [notes, note.id],
    ) ?? [];

  const computeLeadingHint = () => {
    if (children.length === 0) return LexoRank.middle().toString();
    const firstChildRank = LexoRank.parse(children[0].orderHint);
    return firstChildRank.genPrev().toString();
  };

  const computeFinalHint = () => {
    if (children.length === 0) return LexoRank.middle().toString();
    const lastChildRank = LexoRank.parse(
      children[children.length - 1].orderHint,
    );
    return lastChildRank.genNext().toString();
  };

  const handleCreate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    create({ parentId: note.id, orderHint: computeFinalHint() });
  };

  const handleCollapsibleTrigger = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!open);
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const data: NoteDragData = {
      type: DragType.NOTE,
      noteId: note.id,
    };
    event.dataTransfer.setData(
      "application/darkwrite-drag-internal",
      JSON.stringify(data),
    );
    event.dataTransfer.effectAllowed = "move";
    console.log(">>drag start:", data);
  };

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
      return setDragOver(false);
    }
    const data = dataOptional.result;
    if (
      !("type" in data) ||
      data.type !== DragType.NOTE ||
      !("noteId" in data) ||
      (data as NoteDragData).noteId === note.id
    ) {
      return setDragOver(false);
    }
    const { noteId } = data as NoteDragData;
    update({
      id: noteId,
      dto: { parentId: note.id, orderHint: computeFinalHint() },
    });
    setDragOver(false);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDragEnd = () => {
    setDragOver(false);
  };

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        <div
          draggable
          tabIndex={0}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          className={cn(
            "grid grid-cols-[24px_1fr_24px] gap-1.5 p-1 select-none overflow-hidden group text-ellipsis whitespace-nowrap hover:bg-secondary/20 rounded-[8px]",
            dragOver && "bg-primary/20",
          )}
        >
          <Button
            variant={"ghost"}
            onClick={handleCollapsibleTrigger}
            className="p-0 w-6 h-6 rounded-sm  hover:bg-secondary/40"
          >
            <span className="group-hover:hidden">{getNoteIcon(note.icon ?? undefined)}</span>
            <ChevronRight
              size={18}
              className={cn(
                "hidden group-hover:block transition-transform duration-100",
                open && "rotate-90",
              )}
            />
          </Button>
          {note.title}
          <Button
            variant={"ghost"}
            onClick={handleCreate}
            className="p-0 w-6 h-6 rounded-sm hover:bg-secondary/40"
          >
            <Plus size={18} className={cn("hidden group-hover:block")} />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-3">
        <NoteList
          parentId={note.id}
          notes={children}
          leadingOrderHint={computeLeadingHint()}
          finalOrderHint={computeFinalHint()}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
