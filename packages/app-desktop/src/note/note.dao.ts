import { NewNote, Note, note as notesTable, PatchNote } from "@/db/schema";
import {
  isDescendantAsync,
  isNotUndefined,
  NotFoundError,
  ParentId,
  Rank,
} from "@darkwrite/common";
import { and, asc, desc, eq, isNull, like, ne, or, inArray } from "drizzle-orm";
import { Transaction } from "../db";
import { noteToDto } from "./note-mapper";
import { TransactionalDAO } from "@/db/transactional";

const withParent = (parentId: ParentId) =>
  parentId === null
    ? isNull(notesTable.parentId)
    : eq(notesTable.parentId, parentId);

const notTrashed = () =>
  or(isNull(notesTable.isTrashed), ne(notesTable.isTrashed, true));
const isTrashed = () => eq(notesTable.isTrashed, true);
const isFavorite = () => eq(notesTable.isFavorite, true);
const inWorkspace = (workspaceId: string) =>
  eq(notesTable.workspaceId, workspaceId);
const inDatabase = (databaseId: string) =>
  eq(notesTable.databaseId, databaseId);

export class NoteDAO extends TransactionalDAO {
  /** @deprecated */
  static transactional(tx: Transaction) {
    return new NoteDAO(tx);
  }

  /** @deprecated */
  transactional(tx: Transaction) {
    return NoteDAO.transactional(tx);
  }

  async create(note: NewNote) {
    return (await this.tx.insert(notesTable).values(note).returning())[0];
  }

  async update(note: PatchNote) {
    return (
      await this.tx
        .update(notesTable)
        .set(note)
        .where(eq(notesTable.id, note.id))
        .returning()
    ).at(0);
  }

  async updateAll(notes: PatchNote[]): Promise<Note[]> {
    return (await Promise.all(notes.map((n) => this.update(n)))).filter(
      isNotUndefined,
    );
  }

  async findById(id: string) {
    return (
      await this.tx
        .select()
        .from(notesTable)
        .where(eq(notesTable.id, id))
        .limit(1)
    ).at(0);
  }

  async findByIdOrThrow(id: string) {
    const result = await this.findById(id);
    if (!result) throw new NotFoundError("Note", id);
    return result;
  }

  async findAll() {
    return this.tx.select().from(notesTable);
  }

  async findAllByWorkspaceId(workspaceId: string) {
    return this.tx.select().from(notesTable).where(inWorkspace(workspaceId));
  }

  async findAllByDatabaseId(databaseId: string) {
    return this.tx.select().from(notesTable).where(inDatabase(databaseId));
  }

  async findAllByParentId(workspaceId: string, parentId: string | null) {
    return this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), withParent(parentId)));
  }

  async findAllByParentIdSortAsc(workspaceId: string, parentId: ParentId) {
    return this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), withParent(parentId)))
      .orderBy(asc(notesTable.orderHint));
  }

  async deleteMany(ids: string[]) {
    await this.tx.delete(notesTable).where(inArray(notesTable.id, ids));
  }

  async deleteById(id: string) {
    return this.tx.delete(notesTable).where(eq(notesTable.id, id));
  }

  async delete(note: Note) {
    return this.tx.delete(notesTable).where(eq(notesTable.id, note.id));
  }

  async exists(id: string) {
    return (
      (
        await this.tx
          .select()
          .from(notesTable)
          .where(eq(notesTable.id, id))
          .limit(1)
      ).length > 0
    );
  }

  async findFirstNoteInLayer(workspaceId: string, parentId: ParentId) {
    const query = this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), withParent(parentId), notTrashed()))
      .orderBy(asc(notesTable.orderHint));
    const result = await query;
    return result.at(0);
  }

  async findLastNoteInLayer(workspaceId: string, parentId: ParentId) {
    const query = this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), withParent(parentId), notTrashed()))
      .orderBy(desc(notesTable.orderHint))
      .limit(1);

    return (await query).at(0);
  }

  async findAllFavorites(workspaceId: string) {
    return this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), notTrashed(), isFavorite()))
      .orderBy(asc(notesTable.favoriteOrderHint));
  }

  async findAllTrashed(workspaceId: string) {
    return this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), isTrashed()))
      .orderBy(asc(notesTable.trashedAt));
  }

  async findLastNoteInFavorites(workspaceId: string) {
    const query = this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), isFavorite(), notTrashed()))
      .orderBy(desc(notesTable.favoriteOrderHint))
      .limit(1);

    return (await query).at(0);
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
    const getter = async (id: string) => {
      const result = await this.findById(id);
      return result ? noteToDto(result) : null;
    };
    return await isDescendantAsync(potentialChildId, potentialParentId, getter);
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
    return this.tx
      .select()
      .from(notesTable)
      .where(
        and(
          like(notesTable.title, `%${query}%`),
          inWorkspace(workspaceId),
          notTrashed(),
        ),
      );
  }

  async getRecentlyModifiedNotes(workspaceId: string, limit: number) {
    return this.tx
      .select()
      .from(notesTable)
      .where(and(inWorkspace(workspaceId), notTrashed()))
      .orderBy(desc(notesTable.modifiedAt))
      .limit(limit);
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
