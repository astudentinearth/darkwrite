import { CreateNoteDTO, UpdateNoteDTO, NoteResponseDTO } from "@darkwrite/common";

export interface INoteAPI {
  create(dto: CreateNoteDTO): Promise<NoteResponseDTO | null>;
  update(id: string, dto: UpdateNoteDTO): Promise<NoteResponseDTO | null>;
  delete(id: string): Promise<void>;
  getNote(id: string): Promise<NoteResponseDTO | null>;
}