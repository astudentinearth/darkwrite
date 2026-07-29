import type { Note } from "@darkwrite/common";
import type { NoteRow } from "@/db/schema";

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
