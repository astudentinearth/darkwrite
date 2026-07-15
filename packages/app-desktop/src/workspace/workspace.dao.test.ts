import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { applySqlMigrations, createDatabase, type DatabaseType } from "@/db";
import {
  type NewNote,
  type NewWorkspace,
  note as notesTable,
  type Workspace,
  workspace as workspaceTable,
} from "@/db/schema";
import { resolveTx } from "@/db/transactional";
import { WorkspaceDAO, type WorkspaceDAOInstance } from "./workspace.dao";

let db: DatabaseType;
let dao: WorkspaceDAOInstance;

describe("WorkspaceDAO", () => {
  beforeAll(async () => {
    db = createDatabase();
    db = await applySqlMigrations(db);
    dao = WorkspaceDAO(() => resolveTx(db));
  });

  beforeEach(async () => {
    await db.delete(notesTable);
    await db.delete(workspaceTable);
  });

  const createTestWorkspace = async (
    name: string = "Test Workspace",
  ): Promise<Workspace> => {
    const draft: NewWorkspace = {
      createdAt: new Date(),
      name,
    };
    return (await dao.create(draft))._unsafeUnwrap();
  };

  const createTestNote = async (
    workspaceId: string,
    id: string,
  ): Promise<void> => {
    const note: NewNote = {
      id,
      workspaceId,
      title: "Test Note",
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    await db.insert(notesTable).values(note);
  };

  describe("create", () => {
    it("should create a workspace with required fields", async () => {
      const draft: NewWorkspace = {
        createdAt: new Date(),
        name: "My Workspace",
      };

      const result = (await dao.create(draft))._unsafeUnwrap();

      expect(result.id).toBeDefined();
      expect(result.name).toBe(draft.name);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it("should create a workspace with optional fields", async () => {
      const draft: NewWorkspace = {
        createdAt: new Date(),
        name: "Workspace with Icon",
        iconUrl: "https://example.com/icon.png",
      };

      const result = (await dao.create(draft))._unsafeUnwrap();

      expect(result.iconUrl).toBe(draft.iconUrl);
    });
  });

  describe("update", () => {
    it("should update a workspace's name", async () => {
      const workspace = await createTestWorkspace("Original Name");

      const updated = (
        await dao.update({
          id: workspace.id,
          name: "Updated Name",
        })
      )._unsafeUnwrap();

      expect(updated).toBeDefined();
      expect(updated!.name).toBe("Updated Name");
      expect(updated!.id).toBe(workspace.id);
    });

    it("should return error when updating non-existent workspace", async () => {
      const updated = await dao.update({
        id: "non-existent-id",
        name: "Should Fail",
      });

      expect(updated._unsafeUnwrapErr()).toBeDefined();
    });
  });

  describe("findById", () => {
    it("should find a workspace by id", async () => {
      const workspace = await createTestWorkspace("Find Me");

      const result = (await dao.findById(workspace.id))._unsafeUnwrap();

      expect(result).toBeDefined();
      expect(result?.id).toBe(workspace.id);
      expect(result?.name).toBe("Find Me");
    });

    it("should return err for non-existent id", async () => {
      const result = await dao.findById("non-existent-id");

      expect(result._unsafeUnwrapErr()).not.toBeUndefined();
    });
  });

  describe("findAll", () => {
    it("should return all workspaces", async () => {
      await createTestWorkspace("Workspace 1");
      await createTestWorkspace("Workspace 2");
      await createTestWorkspace("Workspace 3");

      const results = (await dao.findAll())._unsafeUnwrap();

      expect(results).toHaveLength(3);
    });

    it("should return empty array when no workspaces exist", async () => {
      const results = await dao.findAll();

      expect(results._unsafeUnwrap()).toHaveLength(0);
    });
  });

  describe("deleteById", () => {
    it("should delete a workspace by id", async () => {
      const workspace = await createTestWorkspace("To Delete");

      await dao.deleteById(workspace.id);

      const result = await dao.findById(workspace.id);
      expect(result._unsafeUnwrapErr()).not.toBeUndefined();
    });

    it("should handle deleting non-existent workspace without error", async () => {
      await expect(
        (async () =>
          (await dao.deleteById("non-existent-id"))._unsafeUnwrap())(),
      ).resolves.not.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete a workspace by passing the workspace object", async () => {
      const workspace = await createTestWorkspace("Delete via Object");

      await dao.delete(workspace);

      const result = await dao.findById(workspace.id);
      expect(result._unsafeUnwrapErr()).not.toBeUndefined();
    });
  });

  describe("setFavoriteIds", () => {
    it("should store cleaned IDs and return them", async () => {
      const ws = await createTestWorkspace();
      await createTestNote(ws.id, "a");
      await createTestNote(ws.id, "b");

      const result = (
        await dao.setFavoriteIds(ws.id, ["a", "b"])
      )._unsafeUnwrap();

      expect(result).toEqual(["a", "b"]);

      const stored = (await dao.findById(ws.id))._unsafeUnwrap();
      expect(stored.favoriteIds).toEqual(["a", "b"]);
    });

    it("should remove duplicates keeping the first occurrence", async () => {
      const ws = await createTestWorkspace();
      await createTestNote(ws.id, "a");
      await createTestNote(ws.id, "b");
      await createTestNote(ws.id, "c");

      const result = (
        await dao.setFavoriteIds(ws.id, ["a", "b", "a", "c", "b"])
      )._unsafeUnwrap();

      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should filter out non-existent note IDs", async () => {
      const ws = await createTestWorkspace();
      await createTestNote(ws.id, "a");

      const result = (
        await dao.setFavoriteIds(ws.id, ["a", "nonexistent"])
      )._unsafeUnwrap();

      expect(result).toEqual(["a"]);
    });

    it("should handle an empty array", async () => {
      const ws = await createTestWorkspace();

      const result = (await dao.setFavoriteIds(ws.id, []))._unsafeUnwrap();

      expect(result).toEqual([]);

      const stored = (await dao.findById(ws.id))._unsafeUnwrap();
      expect(stored.favoriteIds).toEqual([]);
    });

    it("should combine deduplication and existence filtering", async () => {
      const ws = await createTestWorkspace();
      await createTestNote(ws.id, "a");
      await createTestNote(ws.id, "c");

      const result = (
        await dao.setFavoriteIds(ws.id, ["a", "b", "a", "c", "b", "d"])
      )._unsafeUnwrap();

      expect(result).toEqual(["a", "c"]);
    });
  });
});
