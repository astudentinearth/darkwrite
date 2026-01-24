import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import { memo, ReactNode, useState } from "react";
import {
  useNoteDropZone,
  useNoteItem,
  useNoteItemDrag,
} from "../hooks/use-note-item";
import { cn, getNoteIcon } from "@/lib/utils";
import { ChevronRight, Plus } from "lucide-react";
import { navigateToNote } from "@/features/navigation/navigator";

export const NoteListItem = memo(function ({
  id,
  children,
}: {
  id: string;
  children: ReactNode[] | ReactNode;
}) {
  return (
    <>
      <NoteItem id={id}>{children}</NoteItem>
      <NoteDropZone aboveOrParentId={id} mode="below" />
    </>
  );
});

function NoteItem({
  id,
  children,
}: {
  id: string;
  children: ReactNode[] | ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { note, isActive } = useNoteItem(id);
  console.log("render");
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
        onClick={() => navigateToNote(id)}
        onDrop={onDrop}
        className={cn(
          `group grid grid-cols-[20px_1fr] hover:grid-cols-[20px_1fr_20px] w-full
          items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm hover:bg-secondary/50`,
          isActive && "bg-secondary/20 font-medium",
          isDragging && "bg-primary/25",
        )}
      >
        <CollapsibleTrigger asChild className="rounded-sm bg-transparent">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1 rounded-sm justify-center size-5 hover:bg-muted/50"
          >
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
        <span className="flex-1 truncate text-left select-none opacity-75 group-hover:opacity-100">
          {note.title || "Untitled"}
        </span>
        <button
          className={cn(
            "hover:bg-secondary/50 size-5 group-hover:opacity-100 rounded-sm group-hover:flex hidden justify-center items-center",
            isDragging && "hidden",
          )}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <CollapsibleContent className="pl-1.5">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export const NoteDropZone = memo(function ({
  aboveOrParentId,
  mode,
}: {
  aboveOrParentId: string | null;
  mode: "below" | "into";
}) {
  const { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop } =
    useNoteDropZone(aboveOrParentId, mode);
  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn("h-1", isDragging && "bg-primary/20")}
    ></div>
  );
});
