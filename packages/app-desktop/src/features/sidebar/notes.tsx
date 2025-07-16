import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNotesQuery } from "@/hooks/query";
import { useMoveNoteMutation } from "@/hooks/query/use-move-note";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DragEvent, useCallback, useState } from "react";
import { NoteDropZone } from "./note-drop-zone";
import { NoteItem } from "./note-item";
import { useLocalStore } from "@/context/local-state";
import { useTranslation } from "react-i18next";
import { LexoRank } from "lexorank";

/** @deprecated what is going on */
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
    if (target == null || target.length === 0) return <></>;
    const elements: React.JSX.Element[] = [];
    if (target.length === 0) return elements;
    const first = target[0];
    const firstRank = first.orderHint ? LexoRank.parse(first.orderHint).genPrev().toString() : LexoRank.middle().genPrev().toString();
    elements.push(<NoteDropZone key={"drop-$first"} orderHint={firstRank}></NoteDropZone>);
    for (let i = 0; i < target.length; i++) {
      const noteRank =
        target[i].orderHint || LexoRank.middle().genNext().toString();
      const dropRank = LexoRank.parse(noteRank).genNext().toString();
      console.log("drop", i, dropRank);
      elements.push(<NoteItem note={target[i]} key={`note-${target[i].id}`}></NoteItem>);
      elements.push(<NoteDropZone orderHint={dropRank} key={`drop-below-${target[i].id}`}></NoteDropZone>);
    }

    return elements;
  }, [notes]);

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("note_id");
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
