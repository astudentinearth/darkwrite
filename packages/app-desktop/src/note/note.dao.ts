import {
  type DwResultAsync,
  dwErr,
  isDescendantAsync,
  type ParentId,
  Rank,
} from "@darkwrite/common";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  isNull,
  like,
  ne,
  or,
} from "drizzle-orm";
import { ok, ResultAsync } from "neverthrow";
import { dbResult } from "@/db/db-result";
import {
  type NewNote,
  type Note,
  note as notesTable,
  type PatchNote,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";
import { noteToDto } from "./note-mapper";

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

export type OrderKeyDto = { start: string; end: string };

export function NoteDAO(tx: TxResolver) {
  function create(note: NewNote): DwResultAsync<Note> {
    return dbResult(
      async () => (await tx().insert(notesTable).values(note).returning())[0],
    ).andThen((row) =>
      row
        ? ok(row)
        : dwErr(
            "Note failed to create",
            "Expected a note to return from the database, nothing returned.",
          ),
    );
  }

  function update(note: PatchNote): DwResultAsync<Note> {
    return dbResult(async () =>
      (
        await tx()
          .update(notesTable)
          .set(note)
          .where(eq(notesTable.id, note.id))
          .returning()
      ).at(0),
    ).andThen((row) => (row ? ok(row) : dwErr("Note not found")));
  }

  function updateAll(notes: PatchNote[]): DwResultAsync<Note[]> {
    return ResultAsync.combine(notes.map((n) => update(n)));
  }

  function findById(id: string): DwResultAsync<Note> {
    return dbResult(
      async () =>
        await tx()
          .select()
          .from(notesTable)
          .where(eq(notesTable.id, id))
          .limit(1)
          .get(),
    ).andThen((row) => (row ? ok(row) : dwErr("Note not found.")));
  }

  function findAllByWorkspaceId(workspaceId: string): DwResultAsync<Note[]> {
    return dbResult(
      async () =>
        await tx().select().from(notesTable).where(inWorkspace(workspaceId)),
    );
  }

  function deleteMany(ids: string[]): DwResultAsync<void> {
    return dbResult(async () => {
      await tx().delete(notesTable).where(inArray(notesTable.id, ids));
    });
  }

  function deleteById(id: string): DwResultAsync<void> {
    return dbResult(async () => {
      await tx().delete(notesTable).where(eq(notesTable.id, id));
    });
  }

  function deleteNote(note: Note): DwResultAsync<void> {
    return dbResult(async () => {
      await tx().delete(notesTable).where(eq(notesTable.id, note.id));
    });
  }

  function exists(id: string): DwResultAsync<boolean> {
    return dbResult(
      async () =>
        (
          await tx()
            .select()
            .from(notesTable)
            .where(eq(notesTable.id, id))
            .limit(1)
        ).length > 0,
    );
  }

  function findFirstNoteInLayer(
    workspaceId: string,
    parentId: ParentId,
  ): DwResultAsync<Note | undefined> {
    return dbResult(async () => {
      const result = await tx()
        .select()
        .from(notesTable)
        .where(
          and(inWorkspace(workspaceId), withParent(parentId), notTrashed()),
        )
        .orderBy(asc(notesTable.orderHint));
      return result.at(0);
    });
  }

  function findLastNoteInLayer(
    workspaceId: string,
    parentId: ParentId,
  ): DwResultAsync<Note | undefined> {
    return dbResult(async () => {
      const result = await tx()
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

  function findAllFavorites(workspaceId: string): DwResultAsync<Note[]> {
    return dbResult(async () =>
      tx()
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), notTrashed(), isFavorite()))
        .orderBy(asc(notesTable.favoriteOrderHint)),
    );
  }

  function findAllTrashed(workspaceId: string): DwResultAsync<Note[]> {
    return dbResult(async () =>
      tx()
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), isTrashed()))
        .orderBy(asc(notesTable.trashedAt)),
    );
  }

  function isDescendant(
    potentialChildId: ParentId,
    potentialParentId: ParentId,
  ): DwResultAsync<boolean | "CIRCULAR"> {
    return dbResult(async () => {
      if (potentialParentId == null) return false;
      if (potentialChildId == null) return false;
      const getter = async (id: string) => {
        const result = (await findById(id)).unwrapOr(null);
        return result ? noteToDto(result) : null;
      };
      return await isDescendantAsync(
        potentialChildId,
        potentialParentId,
        getter,
      );
    });
  }

  function computeOrderKeysForLayer(
    workspaceId: string,
    parentId: ParentId,
  ): DwResultAsync<OrderKeyDto> {
    return findFirstNoteInLayer(workspaceId, parentId).andThen((firstInLayer) =>
      findLastNoteInLayer(workspaceId, parentId).map((lastInLayer) => {
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

  function computeOrderKeysForFavorites(
    workspaceId: string,
  ): DwResultAsync<OrderKeyDto> {
    return findAllFavorites(workspaceId).map((favorites) => {
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

  function searchByTitle(
    workspaceId: string,
    query: string,
  ): DwResultAsync<Note[]> {
    return dbResult(async () =>
      tx()
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

  function noteRightAfter(
    targetId: string,
    workspaceId: string,
    sortBy: "orderHint" | "favoriteOrderHint" = "orderHint",
  ): DwResultAsync<Note | undefined> {
    const target = tx()
      .select({ [sortBy]: notesTable[sortBy] })
      .from(notesTable)
      .where(and(eq(notesTable.id, targetId), inWorkspace(workspaceId)));
    return dbResult(() =>
      tx()
        .select()
        .from(notesTable)
        .where(
          and(
            gt(notesTable[sortBy], target),
            notTrashed(),
            inWorkspace(workspaceId),
          ),
        )
        .orderBy(asc(notesTable[sortBy]))
        .limit(1),
    ).map((n) => n.at(0));
  }

  return {
    create,
    update,
    updateAll,
    findById,
    findAllByWorkspaceId,
    deleteMany,
    deleteById,
    delete: deleteNote,
    exists,
    findFirstNoteInLayer,
    findLastNoteInLayer,
    findAllTrashed,
    isDescendant,
    computeOrderKeysForLayer,
    computeOrderKeysForFavorites,
    searchByTitle,
    noteRightAfter,
  };
}

export type NoteDAOInstance = ReturnType<typeof NoteDAO>;
