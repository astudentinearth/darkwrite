import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import { memo, ReactNode, useState } from "react";
import { useNoteItem, useNoteItemDrag } from "../hooks/use-note-item";
import { cn, getNoteIcon } from "@/lib/utils";
import { ChevronRight, Plus } from "lucide-react";

export function NoteListItem({
  id,
  children,
}: {
  id: string;
  children: ReactNode[] | ReactNode;
}) {
  return (
    <>
      <NoteItem id={id}>{children}</NoteItem>
      <NoteDropZone id={id} />
    </>
  );
}

function NoteItem({
  id,
  children,
}: {
  id: string;
  children: ReactNode[] | ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const note = useNoteItem(id);
  const { isDragging, onDrag, onDragEnter, onDragLeave, onDrop, onDragOver } =
    useNoteItemDrag(id);

  if (!note) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        draggable
        onDragStart={onDrag}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          `group grid grid-cols-[20px_1fr] hover:grid-cols-[20px_1fr_20px] w-full
          items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary/50`,
          isDragging && "bg-primary/25",
        )}
      >
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-1 rounded-sm justify-center size-5 hover:bg-muted/50">
            <ChevronRight
              className={cn(
                "size-4 transition-transform duration-100 hidden group-hover:block",
                open && "rotate-90",
              )}
            />
            <span className="flex group-hover:hidden">
              {getNoteIcon(note.icon, "size-4")}
            </span>
          </button>
        </CollapsibleTrigger>
        <span className="flex-1 truncate text-left select-none">
          {note.title || "Untitled"}
        </span>
        <button className="hover:bg-secondary/50 size-5 group-hover:opacity-100 rounded-sm group-hover:flex hidden justify-center items-center">
          <Plus className="size-4" />
        </button>
      </div>
      <CollapsibleContent className="pl-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

const NoteDropZone = memo(function ({ id: _id }: { id: string }) {
  return <div className="h-1 bg-primary/5"></div>;
});
