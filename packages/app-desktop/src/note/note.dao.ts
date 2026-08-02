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
  type NewNoteRow,
  type NoteRow,
  note as notesTable,
  type PatchNoteRow,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";

const withParent = (parentId: ParentId) =>
  parentId === null
    ? isNull(notesTable.parentId)
    : eq(notesTable.parentId, parentId);

const notTrashed = () =>
  or(isNull(notesTable.isTrashed), ne(notesTable.isTrashed, true));
const isTrashed = () => eq(notesTable.isTrashed, true);
const inWorkspace = (workspaceId: string) =>
  eq(notesTable.workspaceId, workspaceId);

export type OrderKeyDto = { start: string; end: string };

export function NoteDAO(tx: TxResolver) {
  function create(note: NewNoteRow): DwResultAsync<NoteRow> {
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

  function update(note: PatchNoteRow): DwResultAsync<NoteRow> {
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

  function updateAll(notes: PatchNoteRow[]): DwResultAsync<NoteRow[]> {
    return ResultAsync.combine(notes.map((n) => update(n)));
  }

  function findById(id: string): DwResultAsync<NoteRow> {
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

  function findAllByWorkspaceId(workspaceId: string): DwResultAsync<NoteRow[]> {
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

  function deleteNote(note: NoteRow): DwResultAsync<void> {
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
  ): DwResultAsync<NoteRow | undefined> {
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
  ): DwResultAsync<NoteRow | undefined> {
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

  function findAllTrashed(workspaceId: string): DwResultAsync<NoteRow[]> {
    return dbResult(async () =>
      tx()
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), isTrashed()))
        .orderBy(asc(notesTable.trashedAt)),
    );
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

  function searchByTitle(
    workspaceId: string,
    query: string,
  ): DwResultAsync<NoteRow[]> {
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
    findAllTrashed,
    computeOrderKeysForLayer,
    searchByTitle,
  };
}

export type NoteDAOInstance = ReturnType<typeof NoteDAO>;
