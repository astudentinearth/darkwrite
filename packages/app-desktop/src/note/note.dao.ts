import {
  isDescendantAsync,
  NotFoundError,
  ParentId,
  Rank,
} from "@darkwrite/common";
import { EntityManager, IsNull, Like, Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Note } from "../entity";

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
    if (!note) throw new NotFoundError("Note", id);
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

  async exists(id: string) {
    return await this.repo.exists({ where: { id } });
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

  async findAllFavorites(workspaceId: string) {
    return this.repo.find({
      where: {
        workspace: { id: workspaceId },
        isFavorite: true,
        isTrashed: false,
      },
      order: {
        favoriteOrderHint: "ASC",
      },
    });
  }

  async findAllTrashed(workspaceId: string) {
    return this.repo.find({
      where: {
        workspace: { id: workspaceId },
        isTrashed: true,
      },
      order: {
        trashedAt: "ASC",
      },
    });
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

  /**
   * Is
   * @param potentialChildId inside
   * @param potentialParentId ?
   * @returns
   */
  async isDescendant(
    potentialChildId: ParentId,
    potentialParentId: ParentId,
  ): Promise<boolean | "CIRCULAR"> {
    if (potentialParentId == null) return false;
    if (potentialChildId == null) return false;
    return await isDescendantAsync(
      potentialChildId,
      potentialParentId,
      async (id: string) => (await this.findById(id))?.mapToDTO(),
    );
  }

  async computeOrderKeysForLayer(workspaceId: string, parentId: ParentId) {
    const firstInLayer = await this.findFirstNoteInLayer(workspaceId, parentId);
    const lastInLayer = await this.findLastNoteInLayer(workspaceId, parentId);

    const start = firstInLayer
      ? new Rank(firstInLayer.orderHint).prev().toString()
      : Rank.default().toString();

    const end = lastInLayer
      ? new Rank(lastInLayer.orderHint).next().toString()
      : Rank.default().toString();

    return { start, end };
  }

  async computeOrderKeysForFavorites(workspaceId: string) {
    const favorites = await this.findAllFavorites(workspaceId);
    const start = favorites.length
      ? new Rank(favorites[0].favoriteOrderHint).prev().toString()
      : Rank.default().toString();

    const end = favorites.length
      ? new Rank(favorites[favorites.length - 1].favoriteOrderHint)
          .next()
          .toString()
      : Rank.default().toString();

    return { start, end };
  }

  async searchByTitle(workspaceId: string, query: string) {
    return this.repo.find({
      where: {
        title: Like(`%${query}%`),
        workspace: { id: workspaceId },
        isTrashed: false,
      },
    });
  }

  async getRecentlyModifiedNotes(workspaceId: string, limit: number) {
    return this.repo.find({
      where: {
        workspace: { id: workspaceId },
        isTrashed: false,
      },
      order: {
        modifiedAt: "DESC",
      },
      take: limit,
    });
  }

  async resolveParentTree(noteId: string): Promise<Note[]> {
    const tree: Note[] = [];
    let currentNote = await this.findById(noteId);
    while (currentNote) {
      tree.push(currentNote);
      if (!currentNote.parentId) break;
      currentNote = await this.findById(currentNote.parentId);
    }
    return tree.reverse();
  }
}
