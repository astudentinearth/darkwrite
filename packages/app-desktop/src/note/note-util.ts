import { Note } from "@/db/schema";
import { NoteDTO } from "@darkwrite/common";
import { noteToDto } from "./note-mapper";

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
