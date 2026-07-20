import type { NoteDTO } from "@/note";

export function notTrashed(note: NoteDTO) {
  return !note.isTrashed;
}

export function withParent(parentId: string | null | undefined) {
  return (note: NoteDTO) => note.parentId === parentId;
}

export enum SortProperty {
  Title = "title",
  CreationDate = "createdAt",
  ModificationDate = "modifiedAt",
}

export type SortDirection = "asc" | "desc";

/** Case-insensitive, natural-order collation for note titles
 * ("Note 2" sorts before "Note 10"). */
const titleCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

/** Builds a compare function for sorting notes by the given property.
 * Dates are compared numerically, titles via {@link titleCollator}. */
export function noteComparator(
  property: SortProperty,
  dir: SortDirection = "asc",
): (a: NoteDTO, b: NoteDTO) => number {
  const sign = dir === "asc" ? 1 : -1;
  switch (property) {
    case SortProperty.Title:
      return (a, b) => sign * titleCollator.compare(a.title, b.title);
    case SortProperty.CreationDate:
      return (a, b) =>
        sign * (Date.parse(a.createdAt) - Date.parse(b.createdAt));
    case SortProperty.ModificationDate:
      return (a, b) =>
        sign * (Date.parse(a.modifiedAt) - Date.parse(b.modifiedAt));
  }
}
