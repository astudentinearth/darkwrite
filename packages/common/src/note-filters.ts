import type { NoteDTO } from "@/note";

export function notTrashed(note: NoteDTO) {
  return !note.isTrashed;
}

export function withParent(parentId: string | null | undefined) {
  return (note: NoteDTO) => note.parentId === parentId;
}

export function byUpdateTime(mode: "asc" | "desc") {
  return (a: NoteDTO, b: NoteDTO) =>
    mode === "asc"
      ? new Date(a.modifiedAt).valueOf() - new Date(b.modifiedAt).valueOf()
      : new Date(b.modifiedAt).valueOf() - new Date(a.modifiedAt).valueOf();
}
