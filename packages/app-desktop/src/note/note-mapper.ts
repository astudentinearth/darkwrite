import type { Note } from "@darkwrite/common";
import type { NewNoteRow, NoteRow } from "@/db/schema";

export function noteToRow(note: Note): NewNoteRow {
  const { createdAt, modifiedAt, trashedAt, ...rest } = note;
  return {
    ...rest,
    createdAt: new Date(createdAt),
    modifiedAt: new Date(modifiedAt),
    trashedAt: trashedAt ? new Date(trashedAt) : null,
  };
}

export function noteToDto(note: NoteRow): Note {
  const { createdAt, modifiedAt, propertyValues, trashedAt, ...rest } = note;
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
