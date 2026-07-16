import {
  type DwResultAsync,
  dwErr,
  isDescendantAsync,
  NoteType,
  type ParentId,
} from "@darkwrite/common";
import { and, asc, desc, eq, inArray, isNull, like, ne, or } from "drizzle-orm";
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
const inWorkspace = (workspaceId: string) =>
  eq(notesTable.workspaceId, workspaceId);

export const noteTypeOf = (type: NoteType) => eq(notesTable.type, type);

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

  function findAll(): DwResultAsync<Note[]> {
    return dbResult(async () => tx().select().from(notesTable));
  }

  function findAllByWorkspaceId(workspaceId: string): DwResultAsync<Note[]> {
    return dbResult(
      async () =>
        await tx().select().from(notesTable).where(inWorkspace(workspaceId)),
    );
  }

  function findAllByParentId(
    workspaceId: string,
    parentId: string | null,
  ): DwResultAsync<Note[]> {
    return dbResult(async () =>
      tx()
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), withParent(parentId))),
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

  function getRecentlyModifiedNotes(
    workspaceId: string,
    limit: number,
  ): DwResultAsync<Note[]> {
    return dbResult(async () =>
      tx()
        .select()
        .from(notesTable)
        .where(and(inWorkspace(workspaceId), notTrashed()))
        .orderBy(desc(notesTable.modifiedAt))
        .limit(limit),
    );
  }

  function resolveParentTree(noteId: string): DwResultAsync<Note[]> {
    return dbResult(async () => {
      const tree: Note[] = [];
      let currentId: string | null = noteId;
      while (currentId) {
        const note: Note | null = (await findById(currentId)).unwrapOr(null);
        if (!note) break;
        tree.push(note);
        currentId = note.parentId;
      }
      return tree.reverse();
    });
  }

  const getAllDocumentsInDatabase = (databaseId: string) =>
    dbResult(() =>
      tx()
        .select()
        .from(notesTable)
        .where(
          and(withParent(databaseId), noteTypeOf(NoteType.Doc), notTrashed()),
        ),
    );

  const getAllDatabasesInWorkspace = (
    workspaceId: string,
  ): DwResultAsync<Note[]> =>
    dbResult(() =>
      tx()
        .select()
        .from(notesTable)
        .where(
          and(
            inWorkspace(workspaceId),
            notTrashed(),
            noteTypeOf(NoteType.Database),
          ),
        ),
    );

  return {
    create,
    update,
    updateAll,
    findById,
    findAll,
    findAllByWorkspaceId,
    findAllByParentId,
    deleteMany,
    deleteById,
    delete: deleteNote,
    exists,
    findAllTrashed,
    isDescendant,
    searchByTitle,
    getRecentlyModifiedNotes,
    resolveParentTree,
    getAllDocumentsInDatabase,
    getAllDatabasesInWorkspace,
  };
}

export type NoteDAOInstance = ReturnType<typeof NoteDAO>;
