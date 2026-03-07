import { NoteDTO } from "@/common/dto";
import { Note } from "../entity";

export function mapNotesToDTO(notes: Note[]): Record<string, NoteDTO> {
  return notes
    .map((n) => n.mapToDTO())
    .reduce(
      (acc, current) => {
        acc[current.id] = current;
        return acc;
      },
      {} as Record<string, NoteDTO>,
    );
}
