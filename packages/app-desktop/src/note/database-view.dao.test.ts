import { randomUUID } from "node:crypto";
import { DatabaseViewType, type ParentId, Rank } from "@darkwrite/common";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  applySqlMigrations,
  createTestDatabase,
  type DatabaseType,
} from "@/db";
import {
  type NewDatabaseViewRow,
  type NewNote,
  type Note,
  note as notesTable,
  databaseView as viewsTable,
  type Workspace,
} from "@/db/schema";
import { resolveTx } from "@/db/transactional";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { DatabaseViewDAO } from "./database-view.dao";
import { NoteDAO } from "./note.dao";

const db: DatabaseType = createTestDatabase();

describe("DatabaseViewDAO", () => {
  let noteDao = NoteDAO(() => resolveTx(db));
  let viewDao = DatabaseViewDAO(() => resolveTx(db));
  let workspaceId = "";

  beforeAll(async () => {
    await applySqlMigrations(db);
    noteDao = NoteDAO(() => resolveTx(db));
    viewDao = DatabaseViewDAO(() => resolveTx(db));

    const workspace: Workspace = (
      await WorkspaceDAO(() => resolveTx(db)).create({
        name: "Test Workspace",
        createdAt: new Date(),
      })
    )._unsafeUnwrap();

    workspaceId = workspace.id;
  });

  beforeEach(async () => {
    await db.delete(viewsTable);
    await db.delete(notesTable);
  });

  const buildNote = async (
    id: string,
    parentId: string | null = null,
  ): Promise<Note> => {
    return {
      id,
      title: `Test Note${id}`,
      workspaceId: workspaceId,
      parentId,
      favoriteOrderHint: Rank.default().get(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      icon: null,
      isFavorite: false,
      isTrashed: null,
      trashedAt: null,
      type: "doc",
    };
  };

  const createDatabaseNote = async (
    id: string,
    parentId: ParentId = null,
  ): Promise<Note> => {
    const note = await buildNote(id, parentId);
    return (
      await noteDao.create({ ...note, type: "database" })
    )._unsafeUnwrap();
  };

  const createDatabaseViewNote = async (
    id: string,
    databaseId: string,
  ): Promise<Note> => {
    const note = await buildNote(id, databaseId);
    return (
      await noteDao.create({ ...note, type: "database_view" })
    )._unsafeUnwrap();
  };

  describe("getView, createView, getAllViewsOf, getViewsByIds", () => {
    it("createView should create a view with the given type", async () => {
      const viewId = randomUUID();
      await createDatabaseViewNote(viewId, randomUUID());

      const created = (
        await viewDao.createView({
          id: viewId,
          type: DatabaseViewType.Table,
        })
      )._unsafeUnwrap();

      expect(created).not.toBeUndefined();
      expect(created.id).toBe(viewId);
      expect(created.type).toBe(DatabaseViewType.Table);
    });

    it("getView should return the view when it exists", async () => {
      const viewId = randomUUID();
      await createDatabaseViewNote(viewId, randomUUID());
      await viewDao.createView({ id: viewId, type: DatabaseViewType.Board });

      const found = (await viewDao.getView(viewId))._unsafeUnwrap();

      expect(found).not.toBeUndefined();
      expect(found.id).toBe(viewId);
      expect(found.type).toBe(DatabaseViewType.Board);
    });

    it("getView should return err when the view does not exist", async () => {
      const result = await viewDao.getView(randomUUID());

      expect(result.isErr()).toBe(true);
    });

    it("getAllViewsOf should return all views under a database", async () => {
      const databaseId = randomUUID();
      await createDatabaseNote(databaseId);

      const viewAId = randomUUID();
      const viewBId = randomUUID();
      await createDatabaseViewNote(viewAId, databaseId);
      await createDatabaseViewNote(viewBId, databaseId);
      await viewDao.createView({ id: viewAId, type: DatabaseViewType.Table });
      await viewDao.createView({ id: viewBId, type: DatabaseViewType.Board });

      const views = (await viewDao.getAllViewsOf(databaseId))._unsafeUnwrap();
      const viewIds = views.map((v) => v.database_view.id);

      expect(viewIds).toContain(viewAId);
      expect(viewIds).toContain(viewBId);
    });

    it("getAllViewsOf should exclude notes that are not database_view type", async () => {
      const databaseId = randomUUID();
      await createDatabaseNote(databaseId);

      const viewId = randomUUID();
      const docId = randomUUID();
      await createDatabaseViewNote(viewId, databaseId);
      await viewDao.createView({ id: viewId, type: DatabaseViewType.Table });
      // A doc note under the same database without a corresponding view row
      const note = await buildNote(docId, databaseId);
      await noteDao.create(note);

      const views = (await viewDao.getAllViewsOf(databaseId))._unsafeUnwrap();
      const viewIds = views.map((v) => v.database_view.id);

      expect(viewIds).toEqual([viewId]);
    });

    it("getAllViewsOf should return empty array when database has no views", async () => {
      const databaseId = randomUUID();
      await createDatabaseNote(databaseId);

      const views = (await viewDao.getAllViewsOf(databaseId))._unsafeUnwrap();

      expect(views).toEqual([]);
    });

    it("getViewsByIds should return only the views matching the given ids", async () => {
      const viewAId = randomUUID();
      const viewBId = randomUUID();
      const viewCId = randomUUID();

      await createDatabaseViewNote(viewAId, randomUUID());
      await createDatabaseViewNote(viewBId, randomUUID());
      await createDatabaseViewNote(viewCId, randomUUID());
      await viewDao.createView({ id: viewAId, type: DatabaseViewType.Table });
      await viewDao.createView({ id: viewBId, type: DatabaseViewType.Board });
      await viewDao.createView({
        id: viewCId,
        type: DatabaseViewType.Calendar,
      });

      const views = (
        await viewDao.getViewsByIds([viewAId, viewCId])
      )._unsafeUnwrap();
      const viewIds = views.map((v) => v.database_view.id);

      expect(viewIds).toContain(viewAId);
      expect(viewIds).toContain(viewCId);
      expect(viewIds).not.toContain(viewBId);
    });

    it("getViewsByIds should return empty array when no ids match", async () => {
      const result = (
        await viewDao.getViewsByIds([randomUUID(), randomUUID()])
      )._unsafeUnwrap();

      expect(result).toEqual([]);
    });

    it("getViewsByIds should handle empty id array", async () => {
      const result = (await viewDao.getViewsByIds([]))._unsafeUnwrap();

      expect(result).toEqual([]);
    });
  });
});
