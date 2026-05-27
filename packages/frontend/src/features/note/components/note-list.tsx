import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useNoteListState } from "../hooks/use-note-list-state";
import { NoteDropZone, NoteListItem } from "./note-list-item";

export interface NoteListProps {
  className?: string;
  parentId: string | null;
}

export default function NoteList(props: NoteListProps) {
  const state = useNoteListState(props.parentId);
  const { t } = useTranslation();

  const items = useMemo(() => {
    return state.noteIds.map((id) => (
      <NoteListItem id={id} key={id}>
        <NoteList className={cn(id != null && "pl-1")} parentId={id} />
      </NoteListItem>
    ));
  }, [state.noteIds]);

  return (
    <div
      className={cn(
        "flex flex-col",
        props.parentId != null && "border-l border-border/25",
        props.className,
      )}
    >
      {items.length > 0 ? (
        <>
          <NoteDropZone aboveOrParentId={props.parentId} mode="into" />
          {items}
        </>
      ) : (
        <span className="text-xs text-foreground/75 pl-2 py-2">
          {t("sidebar.notes.noPages")}
        </span>
      )}
    </div>
  );
}
