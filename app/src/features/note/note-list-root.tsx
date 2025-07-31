import { useNotes } from "@/query/use-notes";
import NoteItem from "./note-item";
import NoteList from "./note-list";
import { useMemo } from "react";
import { useT } from "@/hooks/useT";
import { LexoRank } from "lexorank";

export default function NoteListRoot() {
  const { notes } = useNotes();
  const t = useT();
  const rootNotes = useMemo(() => notes?.filter((n) => !n.parentId), [notes]);

  if (rootNotes == null || rootNotes.length === 0) {
    return (
      <div>
        <span>{t("notes.noPages")}</span>
      </div>
    );
  }

  const leadingHint = LexoRank.parse(rootNotes[0].orderHint).genPrev().toString();
  const finalHint = LexoRank.parse(rootNotes[rootNotes.length - 1].orderHint).genNext().toString();

  return (
    <div>
      <NoteList notes={rootNotes} leadingOrderHint={leadingHint} finalOrderHint={finalHint}/>
    </div>
  );
}
