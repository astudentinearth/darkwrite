import { NoteDTO } from "@/common/dto";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { cn, getNoteIcon } from "@/lib/utils";
import React from "react";
import { useNoteItemDrag } from "./note-list-logic";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { MouseEvent } from "react";
import { useCreateNoteMutation } from "@/query/use-create-note";

export type NoteHeaderProps = {
  collapsible?: boolean;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  note: NoteDTO;
  showCreate?: boolean;
  contextMenuOpen?: boolean;
  finalOrderHint?: string;
} & React.ComponentProps<"div">;

export default function NoteHeader({
  collapsible,
  setOpen,
  note,
  open,
  showCreate,
  finalOrderHint,
  contextMenuOpen,
  ...props
}: NoteHeaderProps) {
  const nav = useNavigateToNote();
  const { dragProps, isDraggingOver } = useNoteItemDrag(note, finalOrderHint ?? "");
  const {onDrop, ...rest} = dragProps;
  const { create } = useCreateNoteMutation();
  const handleCreate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    create({ parentId: note.id, orderHint: finalOrderHint });
  };
  return (
    <div
      {...rest}
      onDrop={finalOrderHint ? onDrop : ()=>{}}
      {...props}
      onClick={() => nav(note.id)}
      className={cn(
        "grid grid-cols-[24px_1fr_24px] gap-1.5 p-1 select-none overflow-hidden group text-ellipsis whitespace-nowrap hover:bg-secondary/20 rounded-[8px]",
        isDraggingOver && finalOrderHint && "bg-primary/20",
        contextMenuOpen && "bg-secondary/20",
        (!showCreate && !collapsible) && "flex"
      )}
    >
      <Button
        variant={"ghost"}
        onClick={(event) => {
          if(collapsible) event.stopPropagation();
          setOpen?.call(undefined, !open)
        }}
        className={cn("p-0 w-6 h-6 rounded-sm hover:bg-secondary/40",
          !collapsible && "hover:bg-transparent"
        )}
      >
        <span className={cn(collapsible && "group-hover:hidden")}>
          {getNoteIcon(note.icon ?? undefined)}
        </span>
        <ChevronRight
          size={18}
          className={cn(
            "hidden transition-transform duration-100",
            open && "rotate-90",
            collapsible && " group-hover:block"
          )}
        />
      </Button>
      {note.title}
      {showCreate && <Button
        variant={"ghost"}
        onClick={handleCreate}
        className="p-0 w-6 h-6 rounded-sm hover:bg-secondary/40"
      >
        <Plus size={18} className={cn("hidden group-hover:block")} />
      </Button>}
    </div>
  );
}
