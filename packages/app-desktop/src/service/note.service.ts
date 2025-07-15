import { CreateNoteDTO, NoteResponseDTO, NotesResponseDTO, UpdateNoteDTO } from "@darkwrite/common";
import { Note } from "@darkwrite/common/models";
import { DocumentRepository, NoteRepository } from "@renderer/db";
import { generateId } from "@renderer/lib/utils";

export class NoteService {
  constructor(
    private noteRepository: NoteRepository = new NoteRepository(), 
    private documentRepository: DocumentRepository = new DocumentRepository()
  ) {}
  async createNote(dto: CreateNoteDTO): Promise<NoteResponseDTO | null> {
    const id = generateId();
    const note: Note = {
      id,
      createdAt: new Date(),
      modifiedAt: new Date(),
      orderHint: "",
      favoriteOrderHint: "",
      icon: "",
      ...dto
    }
    await this.noteRepository.save(note);
    await this.documentRepository.saveById(id, "");
    return {note};
  }

  async updateNote(id: string, dto: UpdateNoteDTO): Promise<NoteResponseDTO | null> {
    const existing = await this.noteRepository.findById(id);
    if(!existing) throw new Error("Note not found.");
    const updated: Note = {
      ...existing,
      ...dto,
      modifiedAt: new Date()
    };
    await this.noteRepository.save(updated);
    return { note: updated }
  }

  async deleteNote(id: string) {
    await this.noteRepository.deleteById(id);
  }

  async getNote(id: string): Promise<NoteResponseDTO | null> {
    const note = await this.noteRepository.findById(id);
    return note ? {note} : null;
  }

  async getAllNotes(workspaceId: string): Promise<NotesResponseDTO> {
    const notes = await this.noteRepository.findAll(workspaceId);
    return {notes};
  }

}