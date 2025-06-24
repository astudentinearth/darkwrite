import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@renderer/components/ui/collapsible";
import { useNotesQuery } from "@renderer/hooks/query";
import { useMoveNoteMutation } from "@renderer/hooks/query/use-move-note";
import { cn } from "@renderer/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DragEvent, useCallback, useState } from "react";
import { NoteDropZone } from "./note-drop-zone";
import { NoteItem } from "./note-item";
import { useLocalStore } from "@renderer/context/local-state";
import { useTranslation } from "react-i18next";

export function NotesWidget() {
  const notesQuery = useNotesQuery();
  const moveMutation = useMoveNoteMutation();
  const notes = notesQuery.data;
  const move = moveMutation.mutate;
  const open = !useLocalStore((s) => s.allNotesCollapsed);
  const setCollapsed = useLocalStore((s) => s.setAllNotesCollapsed);
  const setOpen = (val: boolean) => setCollapsed(!val);
  const [dragOver, setDragOver] = useState(false);
  const { t } = useTranslation();

  const render = useCallback(() => {
    const target = notes
      ?.filter((n) => n.parentId == null && !n.isTrashed)
      .toSorted((a, b) => a.orderHint.localeCompare(b.orderHint));
    if (target == null) return <></>;
    const elements: React.JSX.Element[] = [];
    if (target.length === 0) return elements;
    for (let i = 0; i < target.length; i++) {
      elements.push(
        <NoteDropZone
          key={i}
          belowID={target[i].id}
          parentID={null}
        ></NoteDropZone>,
      );
      elements.push(<NoteItem note={target[i]} key={target[i].id}></NoteItem>);
    }
    elements.push(
      <NoteDropZone key={"$last"} last parentID={null}></NoteDropZone>,
    );
    return elements;
  }, [notes]);

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("note_id");
    //console.log("Dropping to top");
    move({ sourceId: data, destinationId: undefined });
    setDragOver(false);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDragEnd = () => {
    setDragOver(false);
  };
  return (
    <div className={cn("rounded-[12px]", dragOver && "bg-card/90")}>
      <Collapsible
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center select-none text-foreground/50 hover:text-foreground transition-colors text-sm p-1">
            {open ? (
              <ChevronDown size={14}></ChevronDown>
            ) : (
              <ChevronRight size={14}></ChevronRight>
            )}
            <span>{t("sidebar.title.allNotes")}</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>{render()}</CollapsibleContent>
      </Collapsible>
    </div>
  );
}
