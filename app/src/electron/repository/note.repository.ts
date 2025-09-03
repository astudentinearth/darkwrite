import { Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Note } from "../entity";

export class NoteRepository {
  private _repo: Repository<Note>;
  constructor(private _datasource = AppDataSource) {
    this._repo = _datasource.getRepository(Note);
  }

  async save(note: Note) {
    return this._repo.save(note);
  }

  async saveAll(notes: Note[]) {
    return this._repo.save(notes);
  }

  async findById(id: string) {
    return this._repo.findOne({ where: { id } });
  }

  async findAll() {
    return this._repo.find();
  }

  async findAllByWorkspaceId(workspaceId: string) {
    return this._repo.findBy({ workspace: { id: workspaceId } });
  }

  async findAllByDatabaseId(databaseId: string) {
    return this._repo.findBy({ database: { id: databaseId } });
  }

  async deleteById(id: string) {
    return this._repo.delete({ id });
  }

  async delete(note: Note) {
    return this._repo.delete({ id: note.id });
  }

  async findLastNoteInOrder(workspaceId: string) {
    const result = await this._repo.findOne({
      order: {
        orderHint: "DESC",
      },
      where: { workspace: { id: workspaceId } },
    });
    return result;
  }

  async findLastNoteInFavorites(workspaceId: string) {
    const result = await this._repo.findOne({
      order: { favoriteOrderHint: "DESC" },
      where: {workspace: {id: workspaceId}}
    });
    return result;
  }
}
