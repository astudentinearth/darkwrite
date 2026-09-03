import type { Note, NotePartial } from "@darkwrite/common";
import type { NewNoteRow, NoteRow, PatchNoteRow } from "@/db/schema";

export function noteToRow(note: Note): NewNoteRow {
  const { createdAt, modifiedAt, trashedAt, ...rest } = note;
  return {
    ...rest,
    createdAt: new Date(createdAt),
    modifiedAt: new Date(modifiedAt),
    trashedAt: trashedAt ? new Date(trashedAt) : null,
  };
}

export function notePartialToRowPatch(note: NotePartial): PatchNoteRow {
  const { createdAt, modifiedAt, trashedAt, ...rest } = note;
  const patch: PatchNoteRow = { ...rest };
  if (createdAt !== undefined) patch.createdAt = new Date(createdAt);
  if (modifiedAt !== undefined) patch.modifiedAt = new Date(modifiedAt);
  if ("trashedAt" in note)
    patch.trashedAt = trashedAt ? new Date(trashedAt) : null;
  return patch;
}

export function noteToDto(note: NoteRow): Note {
  const { createdAt, modifiedAt, trashedAt, ...rest } = note;
  return {
    ...rest,
    trashedAt: trashedAt?.toISOString() ?? null,
    createdAt: createdAt.toISOString(),
    modifiedAt: modifiedAt.toISOString(),
  };
}

export function notesToDto(notes: NoteRow[]) {
  return notes
    .map((n) => noteToDto(n))
    .reduce(
      (acc, current) => {
        acc[current.id] = current;
        return acc;
      },
      {} as Record<string, Note>,
    );
}
