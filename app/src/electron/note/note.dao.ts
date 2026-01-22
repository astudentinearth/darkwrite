import { EntityManager, IsNull, Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Note } from "../entity";
import { ParentId } from "@/common/note";

export class NoteDAO {
  constructor(
    private repo: Repository<Note> = AppDataSource.getRepository(Note),
  ) {}

  async save(note: Note) {
    return this.repo.save(note);
  }

  static transactional(manager: EntityManager) {
    return new NoteDAO(manager.getRepository(Note));
  }

  async saveAll(notes: Note[]) {
    return this.repo.save(notes);
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdOrThrow(id: string) {
    const note = await this.repo.findOne({ where: { id } });
    if (!note) throw new Error(`Note with id ${id} not found.`);
    return note;
  }

  async findAll() {
    return this.repo.find();
  }

  async findAllByWorkspaceId(workspaceId: string) {
    return this.repo.findBy({ workspace: { id: workspaceId } });
  }

  async findAllByDatabaseId(databaseId: string) {
    return this.repo.findBy({ database: { id: databaseId } });
  }

  async findAllByParentId(workspaceId: string, parentId: string | null) {
    return this.repo.findBy({
      workspace: { id: workspaceId },
      parentId: parentId === null ? IsNull() : parentId,
    });
  }

  async findAllByParentIdSortAsc(workspaceId: string, parentId: ParentId) {
    return this.repo.find({
      where: {
        workspace: { id: workspaceId },
        parentId: parentId === null ? IsNull() : parentId,
      },
      order: {
        orderHint: "ASC",
      },
    });
  }

  async deleteById(id: string) {
    return this.repo.delete({ id });
  }

  async delete(note: Note) {
    return this.repo.delete({ id: note.id });
  }

  async findLastNoteInOrder(workspaceId: string) {
    const result = await this.repo.findOne({
      order: {
        orderHint: "DESC",
      },
      where: { workspace: { id: workspaceId }, isTrashed: false },
    });
    return result;
  }

  async findFirstNoteInLayer(workspaceId: string, parentId: ParentId) {
    const result = await this.repo.findOne({
      order: {
        orderHint: "ASC",
      },
      where: {
        workspace: { id: workspaceId },
        parentId: parentId === null ? IsNull() : parentId,
        isTrashed: false,
      },
    });
    return result;
  }

  async findLastNoteInLayer(workspaceId: string, parentId: ParentId) {
    const result = await this.repo.findOne({
      order: {
        orderHint: "DESC",
      },
      where: {
        workspace: { id: workspaceId },
        parentId: parentId === null ? IsNull() : parentId,
        isTrashed: false,
      },
    });
    return result;
  }

  async findLastNoteInFavorites(workspaceId: string) {
    const result = await this.repo.findOne({
      order: { favoriteOrderHint: "DESC" },
      where: {
        workspace: { id: workspaceId },
        isFavorite: true,
        isTrashed: false,
      },
    });
    return result;
  }
}
