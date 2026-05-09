import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createDatabase, DatabaseType, applySqlMigrations } from "@/db";
import { WorkspaceDAO, WorkspaceDAOInstance } from "./workspace.dao";
import {
  NewWorkspace,
  workspace as workspaceTable,
  Workspace,
} from "@/db/schema";
import { resolveTx } from "@/db/transactional";

let db: DatabaseType;
let dao: WorkspaceDAOInstance;

describe("WorkspaceDAO", () => {
  beforeAll(async () => {
    db = createDatabase();
    db = await applySqlMigrations(db);
    dao = WorkspaceDAO(() => resolveTx(db));
  });

  beforeEach(async () => {
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

      expect(updated._unsafeUnwrapErr().type).toBe("workspace-not-found");
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

      expect(result._unsafeUnwrapErr()).toMatchObject({
        type: "workspace-not-found",
      });
    });
  });

  describe("findByIdOrThrow", () => {
    it("should return workspace when found", async () => {
      const workspace = await createTestWorkspace("Throw Test");

      const result = await dao.findByIdOrThrow(workspace.id);

      expect(result.id).toBe(workspace.id);
      expect(result.name).toBe("Throw Test");
    });

    it("should throw NotFoundError when not found", async () => {
      await expect(dao.findByIdOrThrow("non-existent-id")).rejects.toThrow();
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
      expect(result._unsafeUnwrapErr().type).toBe("workspace-not-found");
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
      expect(result._unsafeUnwrapErr()).toMatchObject({
        type: "workspace-not-found",
      });
    });
  });
});
