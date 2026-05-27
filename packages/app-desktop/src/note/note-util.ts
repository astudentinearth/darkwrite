import type { NoteDTO } from "@darkwrite/common";
import type { Note } from "@/db/schema";
import { noteToDto } from "./note-mapper";

/** @deprecated moved */
export function mapNotesToDTO(notes: Note[]): Record<string, NoteDTO> {
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
