import { CreateNoteDTO, NoteResponseDTO, UpdateNoteDTO } from "@darkwrite/common";
import { NoteService } from "@renderer/service/note.service";
import { INoteAPI } from "../api-client";

export class LocalNoteAPI implements INoteAPI {
  constructor(private noteService: NoteService) {}

  create(dto: CreateNoteDTO): Promise<NoteResponseDTO | null> {
    return this.noteService.createNote(dto);
  }

  update(id: string, dto: UpdateNoteDTO): Promise<NoteResponseDTO | null> {
      return this.noteService.updateNote(id, dto);
  }

  delete(id: string): Promise<void> {
    return this.noteService.deleteNote(id);
  }

  getNote(id: string): Promise<NoteResponseDTO | null> {
    return this.noteService.getNote(id);
  }
}
