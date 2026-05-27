import type { Note } from "@/db/schema";
import type { NoteDTO } from "@darkwrite/common";

export function noteToDto(note: Note): NoteDTO {
  const { createdAt, modifiedAt, propertyValues, trashedAt, ...rest } = note;
  return {
    ...rest,
    trashedAt: trashedAt?.toISOString() ?? null,
    createdAt: createdAt.toISOString(),
    modifiedAt: modifiedAt.toISOString(),
    propertyValues: (propertyValues as Record<string, string>) ?? null,
  };
}

export function dtoToNote(dto: NoteDTO): Note {
  const { createdAt, modifiedAt, propertyValues, trashedAt, ...rest } = dto;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    modifiedAt: new Date(modifiedAt),
    propertyValues: propertyValues,
    trashedAt: trashedAt ? new Date(trashedAt) : null,
    userId: rest.userId,
    icon: rest.icon,
  };
}

export function notesToDto(notes: Note[]) {
  return notes
    .map((n) => noteToDto(n))
    .reduce(
      (acc, current) => {
        acc[current.id] = current;
        return acc;
      },
      {} as Record<string, NoteDTO>,
    );
}

