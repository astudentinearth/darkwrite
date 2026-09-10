import { type DwResultAsync, dwErr } from "@darkwrite/common";
import { and, asc, eq, inArray } from "drizzle-orm";
import { ok, ResultAsync } from "neverthrow";
import { dbResult } from "@/db/db-result";
import {
  type NewNoteRow,
  type NoteRow,
  note as notesTable,
  type PatchNoteRow,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";

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

  function findAllTrashed(workspaceId: string): DwResultAsync<NoteRow[]> {
    return dbResult(async () =>
      tx()
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), isTrashed()))
        .orderBy(asc(notesTable.trashedAt)),
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
    exists,
    findAllTrashed,
  };
}

export type NoteDAOInstance = ReturnType<typeof NoteDAO>;
