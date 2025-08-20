import { useNotes } from "@/query/use-notes";
import { LexoRank } from "lexorank";

export default function useOrderHint() {
  const notesQuery = useNotes();

  let finalOrderHint: string = "";
  const notes = Object.values(notesQuery.notes ?? {});
  if (notesQuery.notes == null || notes.length == 0)
    finalOrderHint = LexoRank.middle().genNext().toString();
  else {
    const lastOrderHint = LexoRank.parse(notes[notes.length - 1].orderHint);
    finalOrderHint = lastOrderHint.genNext().toString();
  }

  return { finalOrderHint };
}
