import { cn } from "@/lib/utils";
import { useNoteListState } from "../hooks/use-note-list-state";
import { NoteListItem } from "./note-list-item";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

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
        <NoteList parentId={id} />
      </NoteListItem>
    ));
  }, [state.noteIds]);

  return (
    <div className={cn("flex flex-col", props.className)}>
      {items.length > 0 ? items : t("sidebar.notes.noPages")}
    </div>
  );
}
