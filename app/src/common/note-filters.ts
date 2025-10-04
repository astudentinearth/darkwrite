import { NoteDTO } from "./dto";

export function notTrashed(note: NoteDTO) {
  return !note.isTrashed
}

export function notTrashedAndIsFavorite(note: NoteDTO) {
  return !note.isTrashed && note.isFavorite
}

export function withParent(parentId: string | null | undefined) {
  return (note: NoteDTO) => note.parentId === parentId;
}

export function byUpdateTime(mode: "asc" | "desc") {
  return (a: NoteDTO, b: NoteDTO) => mode === "asc" ? a.modifiedAt.valueOf() - b.modifiedAt.valueOf() : b.modifiedAt.valueOf() - a.modifiedAt.valueOf();
}

