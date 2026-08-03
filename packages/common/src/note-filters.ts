import type { Note } from "./note";

export function notTrashed(note: Note) {
  return !note.isTrashed;
}

export function notTrashedAndIsFavorite(note: Note) {
  return !note.isTrashed && note.isFavorite;
}

export function withParent(parentId: string | null | undefined) {
  return (note: Note) => note.parentId === parentId;
}

export function byUpdateTime(mode: "asc" | "desc") {
  return (a: Note, b: Note) =>
    mode === "asc"
      ? new Date(a.modifiedAt).valueOf() - new Date(b.modifiedAt).valueOf()
      : new Date(b.modifiedAt).valueOf() - new Date(a.modifiedAt).valueOf();
}
