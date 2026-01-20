import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import { memo, ReactNode, useState } from "react";
import { useNoteItem } from "../hooks/use-note-item";
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

  if (!note) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-1 rounded-sm p-0.5 hover:bg-muted/50">
            <ChevronRight
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-90",
              )}
            />
            {getNoteIcon(note.icon, "size-4")}
          </button>
        </CollapsibleTrigger>
        <span className="flex-1 truncate text-left select-none">
          {note.title || "Untitled"}
        </span>
        <button className="opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100 rounded-sm p-0.5">
          <Plus className="size-4" />
        </button>
      </div>
      <CollapsibleContent className="pl-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

const NoteDropZone = memo(function ({ id }: { id: string }) {
  return <div className="h-1 bg-primary/20"></div>;
});
