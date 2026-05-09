import { NewNote, Note, note as notesTable, PatchNote } from "@/db/schema";
import {
  isDescendantAsync,
  NoteError,
  NotFoundError,
  ParentId,
  Rank,
} from "@darkwrite/common";
import { and, asc, desc, eq, isNull, like, ne, or, inArray } from "drizzle-orm";
import { Transaction } from "../db";
import { noteToDto } from "./note-mapper";
import { DbError, TransactionalDAO } from "@/db/transactional";
import { dbResult } from "@/db/db-result";
import { err, ok, ResultAsync } from "neverthrow";

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

export type NoteDaoResult<T> = ResultAsync<T, DbError | NoteError>;
type OrderKeyDto = { start: string; end: string };

export class NoteDAO extends TransactionalDAO {
  /** @deprecated */
  static transactional(tx: Transaction) {
    return new NoteDAO(tx);
  }

  /** @deprecated */
  transactional(tx: Transaction) {
    return NoteDAO.transactional(tx);
  }

  create(note: NewNote): NoteDaoResult<Note> {
    return dbResult(
      async () =>
        (await this.tx.insert(notesTable).values(note).returning())[0],
    ).andThen((row) =>
      row
        ? ok(row)
        : err({ type: "note-failed-to-create" } satisfies NoteError),
    );
  }

  update(note: PatchNote): NoteDaoResult<Note> {
    return dbResult(async () =>
      (
        await this.tx
          .update(notesTable)
          .set(note)
          .where(eq(notesTable.id, note.id))
          .returning()
      ).at(0),
    ).andThen((row) =>
      row
        ? ok(row)
        : err({ type: "note-not-found", id: note.id } satisfies NoteError),
    );
  }

  updateAll(notes: PatchNote[]): NoteDaoResult<Note[]> {
    return ResultAsync.combine(notes.map((n) => this.update(n)));
  }

  findById(id: string): NoteDaoResult<Note> {
    return dbResult(
      async () =>
        await this.tx
          .select()
          .from(notesTable)
          .where(eq(notesTable.id, id))
          .limit(1)
          .get(),
    ).andThen((row) =>
      row ? ok(row) : err<Note, NoteError>({ type: "note-not-found", id }),
    );
  }

  /** @deprecated use result chaining instead */
  async findByIdOrThrow(id: string) {
    const result = await this.findById(id);
    if (result.isErr()) throw new NotFoundError("Note", id);
    return result.value;
  }

  findAll(): NoteDaoResult<Note[]> {
    return dbResult(async () => this.tx.select().from(notesTable));
  }

  findAllByWorkspaceId(workspaceId: string): NoteDaoResult<Note[]> {
    return dbResult(
      async () =>
        await this.tx.select().from(notesTable).where(inWorkspace(workspaceId)),
    );
  }

  findAllByDatabaseId(databaseId: string): NoteDaoResult<Note[]> {
    return dbResult(async () =>
      this.tx.select().from(notesTable).where(inDatabase(databaseId)),
    );
  }

  findAllByParentId(
    workspaceId: string,
    parentId: string | null,
  ): NoteDaoResult<Note[]> {
    return dbResult(async () =>
      this.tx
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), withParent(parentId))),
    );
  }

  findAllByParentIdSortAsc(
    workspaceId: string,
    parentId: ParentId,
  ): NoteDaoResult<Note[]> {
    return dbResult(async () =>
      this.tx
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), withParent(parentId)))
        .orderBy(asc(notesTable.orderHint)),
    );
  }

  deleteMany(ids: string[]): NoteDaoResult<void> {
    return dbResult(async () => {
      await this.tx.delete(notesTable).where(inArray(notesTable.id, ids));
    });
  }

  deleteById(id: string): NoteDaoResult<void> {
    return dbResult(async () => {
      await this.tx.delete(notesTable).where(eq(notesTable.id, id));
    });
  }

  delete(note: Note): NoteDaoResult<void> {
    return dbResult(async () => {
      await this.tx.delete(notesTable).where(eq(notesTable.id, note.id));
    });
  }

  exists(id: string): NoteDaoResult<boolean> {
    return dbResult(
      async () =>
        (
          await this.tx
            .select()
            .from(notesTable)
            .where(eq(notesTable.id, id))
            .limit(1)
        ).length > 0,
    );
  }

  findFirstNoteInLayer(
    workspaceId: string,
    parentId: ParentId,
  ): NoteDaoResult<Note | undefined> {
    return dbResult(async () => {
      const result = await this.tx
        .select()
        .from(notesTable)
        .where(
          and(inWorkspace(workspaceId), withParent(parentId), notTrashed()),
        )
        .orderBy(asc(notesTable.orderHint));
      return result.at(0);
    });
  }

  findLastNoteInLayer(
    workspaceId: string,
    parentId: ParentId,
  ): NoteDaoResult<Note | undefined> {
    return dbResult(async () => {
      const result = await this.tx
        .select()
        .from(notesTable)
        .where(
          and(inWorkspace(workspaceId), withParent(parentId), notTrashed()),
        )
        .orderBy(desc(notesTable.orderHint))
        .limit(1);
      return result.at(0);
    });
  }

  findAllFavorites(workspaceId: string): NoteDaoResult<Note[]> {
    return dbResult(async () =>
      this.tx
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), notTrashed(), isFavorite()))
        .orderBy(asc(notesTable.favoriteOrderHint)),
    );
  }

  findAllTrashed(workspaceId: string): NoteDaoResult<Note[]> {
    return dbResult(async () =>
      this.tx
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), isTrashed()))
        .orderBy(asc(notesTable.trashedAt)),
    );
  }

  findLastNoteInFavorites(
    workspaceId: string,
  ): NoteDaoResult<Note | undefined> {
    return dbResult(async () => {
      const result = await this.tx
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), isFavorite(), notTrashed()))
        .orderBy(desc(notesTable.favoriteOrderHint))
        .limit(1);
      return result.at(0);
    });
  }

  /**
   * Is
   * @param potentialChildId inside
   * @param potentialParentId ?
   * @returns
   */
  isDescendant(
    potentialChildId: ParentId,
    potentialParentId: ParentId,
  ): NoteDaoResult<boolean | "CIRCULAR"> {
    return dbResult(async () => {
      if (potentialParentId == null) return false;
      if (potentialChildId == null) return false;
      const getter = async (id: string) => {
        const result = (await this.findById(id)).unwrapOr(null);
        return result ? noteToDto(result) : null;
      };
      return await isDescendantAsync(
        potentialChildId,
        potentialParentId,
        getter,
      );
    });
  }

  computeOrderKeysForLayer(
    workspaceId: string,
    parentId: ParentId,
  ): NoteDaoResult<OrderKeyDto> {
    return this.findFirstNoteInLayer(workspaceId, parentId).andThen(
      (firstInLayer) =>
        this.findLastNoteInLayer(workspaceId, parentId).map((lastInLayer) => {
          const start = firstInLayer
            ? new Rank(firstInLayer.orderHint).prev().toString()
            : Rank.default().toString();
          const end = lastInLayer
            ? new Rank(lastInLayer.orderHint).next().toString()
            : Rank.default().toString();
          return { start, end };
        }),
    );
  }

  computeOrderKeysForFavorites(
    workspaceId: string,
  ): NoteDaoResult<OrderKeyDto> {
    return this.findAllFavorites(workspaceId).map((favorites) => {
      const start = favorites.length
        ? new Rank(favorites[0].favoriteOrderHint).prev().toString()
        : Rank.default().toString();
      const end = favorites.length
        ? new Rank(favorites[favorites.length - 1].favoriteOrderHint)
            .next()
            .toString()
        : Rank.default().toString();
      return { start, end };
    });
  }

  searchByTitle(workspaceId: string, query: string): NoteDaoResult<Note[]> {
    return dbResult(async () =>
      this.tx
        .select()
        .from(notesTable)
        .where(
          and(
            like(notesTable.title, `%${query}%`),
            inWorkspace(workspaceId),
            notTrashed(),
          ),
        ),
    );
  }

  getRecentlyModifiedNotes(
    workspaceId: string,
    limit: number,
  ): NoteDaoResult<Note[]> {
    return dbResult(async () =>
      this.tx
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), notTrashed()))
        .orderBy(desc(notesTable.modifiedAt))
        .limit(limit),
    );
  }

  resolveParentTree(noteId: string): NoteDaoResult<Note[]> {
    return dbResult(async () => {
      const tree: Note[] = [];
      let currentId: string | null = noteId;
      while (currentId) {
        const note: Note | null = (await this.findById(currentId)).unwrapOr(
          null,
        );
        if (!note) break;
        tree.push(note);
        currentId = note.parentId;
      }
      return tree.reverse();
    });
  }
}
