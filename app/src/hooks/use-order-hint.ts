import { Rank } from "@/common/rank";
import { useNotes } from "@/query/use-notes";

export default function useOrderHint() {
  const notesQuery = useNotes();

  let finalOrderHint: string = "";
  const notes = Object.values(notesQuery.notes ?? {});
  if (notesQuery.notes == null || notes.length == 0)
    finalOrderHint = Rank.default().next().toString();
  else {
    const lastOrderHint = new Rank(notes[notes.length - 1].orderHint);
    finalOrderHint = lastOrderHint.next().toString();
  }

  return { finalOrderHint };
}
