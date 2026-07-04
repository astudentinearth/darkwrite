import type { NoteDTO, NoteType } from "@darkwrite/common";
import type { Note } from "@/db/schema";

export function noteToDto(note: Note): NoteDTO {
  const { createdAt, modifiedAt, trashedAt, type, ...rest } = note;
  return {
    ...rest,
    trashedAt: trashedAt?.toISOString() ?? null,
    createdAt: createdAt.toISOString(),
    modifiedAt: modifiedAt.toISOString(),
    type: type as NoteType,
  };
}

export function dtoToNote(dto: NoteDTO): Note {
  const { createdAt, modifiedAt, trashedAt, ...rest } = dto;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    modifiedAt: new Date(modifiedAt),
    trashedAt: trashedAt ? new Date(trashedAt) : null,
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
