import { Note } from "@/db/schema";
import { JSONTransformer } from "@/lib/json-transformer";
import { NoteDTO } from "@darkwrite/common";

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
