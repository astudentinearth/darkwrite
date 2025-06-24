import { useNotesQuery } from "./query";

export const useRecentNotes = (count: number = 5) => {
  const notesQuery = useNotesQuery();
  const notes = notesQuery.data?.filter((n) => !n.isTrashed);
  const sorted = notes?.toSorted(
    (a, b) => b.modifiedAt.valueOf() - a.modifiedAt.valueOf(),
  );
  const recents = sorted?.toSpliced(count);
  return recents;
};
