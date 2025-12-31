import { NoteDTO } from "@/common/dto";
import { useNavigateToNote } from "@/hooks/use-navigate-to-note";
import { cn, getNoteIcon } from "@/lib/utils";
import React from "react";
import { useNoteItemDrag } from "./note-list-logic";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { MouseEvent } from "react";
import { useCreateNoteMutation } from "@/query/use-create-note";
import { useNoteFromURL } from "@/query/use-note-from-url";

export type NoteHeaderProps = {
  collapsible?: boolean;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  note: NoteDTO;
  showCreate?: boolean;
  contextMenuOpen?: boolean;
  finalOrderHint?: string;
} & React.ComponentProps<"div">;

export default React.memo(function NoteHeader({
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
  const current = useNoteFromURL();
  const active = current === note.id;
  const { dragProps, isDraggingOver } = useNoteItemDrag(
    note,
    finalOrderHint ?? "",
  );
  const { onDrop, ...rest } = dragProps;
  const { create } = useCreateNoteMutation();

  const handleCreate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    create({ parentId: note.id, orderHint: finalOrderHint });
  };
  return (
    <div
      {...rest}
      onDrop={finalOrderHint ? onDrop : () => {}}
      {...props}
      onClick={() => nav(note.id)}
      className={cn(
        "grid grid-cols-[24px_1fr_24px] gap-1.5 p-1 select-none overflow-hidden group text-ellipsis whitespace-nowrap hover:bg-secondary/30 rounded-[8px]",
        isDraggingOver && finalOrderHint && "bg-primary/20",
        contextMenuOpen && "bg-secondary/30",
        !showCreate && !collapsible && "grid-cols-[24px_1fr]",
        active && "bg-secondary/20",
      )}
    >
      <Button
        variant={"ghost"}
        onClick={(event) => {
          if (collapsible) event.stopPropagation();
          setOpen?.call(undefined, !open);
        }}
        className={cn(
          "p-0 w-6 h-6 rounded-sm hover:bg-secondary/40",
          !collapsible && "hover:bg-transparent",
        )}
      >
        <span
          className={cn(
            "opacity-80",
            collapsible && "group-hover:hidden",
            active && "opacity-100",
          )}
        >
          {getNoteIcon(note.icon ?? undefined)}
        </span>
        <ChevronRight
          size={18}
          className={cn(
            "hidden transition-transform duration-100",
            open && "rotate-90",
            collapsible && " group-hover:block",
          )}
        />
      </Button>
      <span
        title={note.title}
        className={cn(
          "w-full overflow-hidden text-ellipsis wrap-break-word whitespace-nowrap opacity-80 hover:opacity-100",
          active && "opacity-100",
        )}
      >
        {note.title}
      </span>
      {showCreate && (
        <Button
          variant={"ghost"}
          onClick={handleCreate}
          className="p-0 w-6 h-6 rounded-sm hover:bg-secondary/40"
        >
          <Plus size={18} className={cn("hidden group-hover:block")} />
        </Button>
      )}
    </div>
  );
});
