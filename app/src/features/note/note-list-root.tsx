import { useT } from "@/hooks/useT";
import { useNotes } from "@/query/use-notes";
import { LexoRank } from "lexorank";
import { useMemo } from "react";
import NoteList from "./note-list";

export default function NoteListRoot() {
  const { notes } = useNotes();
  const t = useT("sidebar.notes");
  const rootNotes = useMemo(() => notes?.filter((n) => !n.parentId), [notes]);

  if (rootNotes == null || rootNotes.length === 0) {
    return (
      <div>
        <span>{t("noPages")}</span>
      </div>
    );
  }

  const leadingHint = LexoRank.parse(rootNotes[0].orderHint).genPrev().toString();
  const finalHint = LexoRank.parse(rootNotes[rootNotes.length - 1].orderHint).genNext().toString();

  return (
    <div>
      <NoteList parentId={null} notes={rootNotes} leadingOrderHint={leadingHint} finalOrderHint={finalHint}/>
    </div>
  );
}
