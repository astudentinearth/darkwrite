import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { AppDataSource } from "../db/data-source";
import { NoteDAO } from "./note.dao";
import { Note, Workspace } from "../entity";

describe("NoteDAO", () => {
  let noteDao: NoteDAO;
  let workspace: Workspace;

  beforeAll(async () => {
    // Initialize the in-memory database
    await AppDataSource.initialize();
    noteDao = new NoteDAO();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Reset the database state
    await AppDataSource.synchronize(true);

    // Create a default workspace required for notes
    workspace = new Workspace();
    workspace.name = "Test Workspace";
    workspace.created_at = new Date();
    await AppDataSource.getRepository(Workspace).save(workspace);
  });

  const createNote = async (id: string, parentId: string | null = null) => {
    const note = new Note();
    note.id = id;
    note.title = "Test Note " + id;
    note.workspace = workspace;
    note.parentId = parentId;
    note.orderHint = "0|";
    note.favoriteOrderHint = "0|";
    return await noteDao.save(note);
  };

  describe("isDescendant", () => {
    it("should return true when target is the parent (self-descendant check)", async () => {
      // Logic: if (targetId === potentialParentId) return true;
      const res = await noteDao.isDescendant("note1", "note1");
      expect(res).toBe(true);
    });

    it("should return true when target is a direct child", async () => {
      await createNote("parent");
      await createNote("child", "parent");
      const res = await noteDao.isDescendant("child", "parent");
      expect(res).toBe(true);
    });

    it("should return true when target is a grandchild", async () => {
      await createNote("root");
      await createNote("child", "root");
      await createNote("grandchild", "child");
      const res = await noteDao.isDescendant("grandchild", "root");
      expect(res).toBe(true);
    });

    it("should return false when target is the parent of potentialParentId (ancestor)", async () => {
      await createNote("parent");
      await createNote("child", "parent");
      const res = await noteDao.isDescendant("parent", "child");
      expect(res).toBe(false);
    });

    it("should return false when notes are siblings", async () => {
      await createNote("root");
      await createNote("child1", "root");
      await createNote("child2", "root");
      const res = await noteDao.isDescendant("child1", "child2");
      expect(res).toBe(false);
    });

    it("should return false when notes are unrelated", async () => {
      await createNote("note1");
      await createNote("note2");
      const res = await noteDao.isDescendant("note1", "note2");
      expect(res).toBe(false);
    });

    it("should return false when targetId or potentialParentId is null", async () => {
      expect(await noteDao.isDescendant(null, "someId")).toBe(false);
      expect(await noteDao.isDescendant("someId", null)).toBe(false);
      expect(await noteDao.isDescendant(null, null)).toBe(false);
    });

    it("should handle circular references gracefully", async () => {
      // Create a cycle: A -> B -> A
      await createNote("A");
      await createNote("B", "A");

      const noteA = await noteDao.findById("A");
      if (noteA) {
        noteA.parentId = "B";
        await noteDao.save(noteA);
      }

      // Test checking against an unrelated node C
      await createNote("C");
      const res = await noteDao.isDescendant("A", "C");
      expect(res).toBe(false);
    });
  });
});
