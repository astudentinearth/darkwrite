import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { NoteDAO } from "./note.dao";
import { createDatabase, DatabaseType, migrateDatabase } from "@/db";
import { NewNote, note as notesTable, Note, Workspace } from "@/db/schema";
import { ParentId, Rank } from "@darkwrite/common";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { randomUUID } from "crypto";

let db: DatabaseType = createDatabase(":memory:");

describe("NoteDAO", () => {
  let noteDao: NoteDAO;
  let workspaceId = "";

  beforeAll(async () => {
    await migrateDatabase(db);
    noteDao = new NoteDAO(db);

    const workspace: Workspace = await new WorkspaceDAO(db).create({
      name: "Test Workspace",
      createdAt: new Date()
    });

    workspaceId = workspace.id;
  });

  beforeEach(async () => {
    // Reset the database state
    await db.delete(notesTable);
  });

  const buildNote = async (id: string, parentId: string | null = null): Promise<Note> => {
    return {
      id,
      title: "Test Note" + id,
      workspaceId: workspaceId,
      parentId,
      orderHint: Rank.default().get(),
      favoriteOrderHint: Rank.default().get(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      userId: null,
      propertyValues: null,
      databaseId: null,
      icon: null,
      isFavorite: false,
      isTrashed: false,
      trashedAt: null
    };
  };

  const saveNote = async (note: NewNote) => await noteDao.create(note);    
  const createNote = async (id: string, parentId: ParentId = null) => await saveNote(await buildNote(id, parentId));

  describe("create", () => {
    it("should create notes without id", async ()=> {
      const note = await noteDao.create({workspaceId, createdAt: new Date(), modifiedAt: new Date(), favoriteOrderHint: "", orderHint: "", title: "New note",});
      expect(note).not.toBeNull();
      expect(note.title).toBe("New note");
      expect(note.id).not.toBeNull();
    });

    it("should create notes with id", async ()=>{
      const id = randomUUID();
      const note = await noteDao.create({id, workspaceId, createdAt: new Date(), modifiedAt: new Date(), favoriteOrderHint: "", orderHint: "", title: "New note",});
      expect(note).not.toBeNull();
      expect(note.title).toBe("New note");
      expect(note.id).toBe(id);
    });

    it("should not create a note on id conflict", async ()=>{
      const id = randomUUID();
      await createNote(id);
      expect(createNote(id)).rejects.toThrow();
    })
  });


  describe("update", () => {
    it("should update a note", async ()=>{
      const note = await createNote(randomUUID());
      const updated = await noteDao.update({id: note.id, title: "Updated title"});
      expect(note).not.toBeNull();
      expect(updated).not.toBeNull();
      expect(note.id).toBe(updated?.id);
      expect(updated?.title).toBe("Updated title");
    });

    it("should fail to update a note that does not exist", async () => {
      const updated = await noteDao.update({id: randomUUID(), title: "Hello world"});
      expect(updated).toBeUndefined();
    })

    it("should update multiple notes", async () => {
      const note1 = await createNote(randomUUID());
      const note2 = await createNote(randomUUID());

      const updatedNotes = await noteDao.updateAll([
        {id: note1.id, title: "trashed", isTrashed: true},
        {id: note2.id, title: "favorite", isFavorite: true}
      ])

      const updated1 = updatedNotes.find(n => n.id == note1.id);
      const updated2 = updatedNotes.find(n => n.id == note2.id);

      expect(updated1).not.toBeUndefined();
      expect(updated2).not.toBeUndefined();
      expect(updated1?.id).toBe(note1.id);
      expect(updated2?.id).toBe(note2.id);
      expect(updated1?.isTrashed).toBeTruthy();
      expect(updated1?.title).toBe("trashed");
      expect(updated2?.isFavorite).toBeTruthy();
      expect(updated2?.title).toBe("favorite");
    })
  })

  describe("isDescendant", () => {
    


    it("should return 'CIRCULAR' when target is the parent (self-descendant check)", async () => {
      // Logic: if (targetId === potentialParentId) return true;
      const res = await noteDao.isDescendant("note1", "note1");
      expect(res).toBe("CIRCULAR");
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
        await noteDao.update({id: noteA.id, parentId: "B"});
      }

      // Test checking against an unrelated node C
      await createNote("C");
      const res = await noteDao.isDescendant("A", "C");
      expect(res).toBe(false);
    });
  });
});
