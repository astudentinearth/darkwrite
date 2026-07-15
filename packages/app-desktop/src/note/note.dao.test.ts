import { randomUUID } from "node:crypto";
import { type ParentId } from "@darkwrite/common";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  applySqlMigrations,
  createTestDatabase,
  type DatabaseType,
} from "@/db";
import {
  type NewNote,
  type Note,
  note as notesTable,
  type Workspace,
} from "@/db/schema";
import { resolveTx } from "@/db/transactional";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { NoteDAO, type NoteDAOInstance } from "./note.dao";

const db: DatabaseType = createTestDatabase();

describe("NoteDAO", () => {
  let noteDao: NoteDAOInstance;
  let workspaceId = "";

  beforeAll(async () => {
    await applySqlMigrations(db);
    noteDao = NoteDAO(() => resolveTx(db));

    const workspace: Workspace = (
      await WorkspaceDAO(() => resolveTx(db)).create({
        name: "Test Workspace",
        createdAt: new Date(),
      })
    )._unsafeUnwrap();

    workspaceId = workspace.id;
  });

  beforeEach(async () => {
    // Reset the database state
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
      createdAt: new Date(),
      modifiedAt: new Date(),
      icon: null,
      isTrashed: null,
      trashedAt: null,
      type: "doc",
    };
  };

  const saveNote = async (note: NewNote) => await noteDao.create(note);
  const createNote = async (id: string, parentId: ParentId = null) =>
    (await saveNote(await buildNote(id, parentId)))._unsafeUnwrap();

  describe("create", () => {
    it("should create notes without id", async () => {
      const result = await noteDao.create({
        workspaceId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        title: "New note",
      });
      const note = result._unsafeUnwrap();
      expect(note).not.toBeNull();
      expect(note.title).toBe("New note");
      expect(note.id).not.toBeNull();
    });

    it("should create notes with id", async () => {
      const id = randomUUID();
      const result = await noteDao.create({
        id,
        workspaceId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        title: "New note",
      });
      const note = result._unsafeUnwrap();
      expect(note).not.toBeNull();
      expect(note.title).toBe("New note");
      expect(note.id).toBe(id);
    });

    it("should not create a note on id conflict", async () => {
      const id = randomUUID();
      await createNote(id);
      await expect(createNote(id)).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should update a note", async () => {
      const note = await createNote(randomUUID());
      const result = await noteDao.update({
        id: note.id,
        title: "Updated title",
      });
      const updated = result._unsafeUnwrap();
      expect(note).not.toBeNull();
      expect(updated).not.toBeNull();
      expect(note.id).toBe(updated?.id);
      expect(updated?.title).toBe("Updated title");
    });

    it("should fail to update a note that does not exist", async () => {
      const updated = await noteDao.update({
        id: randomUUID(),
        title: "Hello world",
      });
      expect(updated._unsafeUnwrapErr()).not.toBeUndefined();
    });

    it("should update multiple notes", async () => {
      const note1 = await createNote(randomUUID());
      const note2 = await createNote(randomUUID());

      const updatedNotes = (
        await noteDao.updateAll([
          { id: note1.id, title: "trashed", isTrashed: true },
          { id: note2.id, title: "updated", icon: "star" },
        ])
      )._unsafeUnwrap();

      const updated1 = updatedNotes.find((n) => n.id === note1.id);
      const updated2 = updatedNotes.find((n) => n.id === note2.id);

      expect(updated1).not.toBeUndefined();
      expect(updated2).not.toBeUndefined();
      expect(updated1?.id).toBe(note1.id);
      expect(updated2?.id).toBe(note2.id);
      expect(updated1?.isTrashed).toBeTruthy();
      expect(updated1?.title).toBe("trashed");
      expect(updated2?.icon).toBe("star");
      expect(updated2?.title).toBe("updated");
    });
  });

  describe("findById, findByIdOrThrow, findAll, findAllByWorkspaceId, exists", () => {
    it("findById should return the note when it exists", async () => {
      const noteId = randomUUID();
      const saved = await createNote(noteId);

      const found = (await noteDao.findById(noteId))._unsafeUnwrap();

      expect(found).not.toBeUndefined();
      expect(found?.id).toBe(saved.id);
    });

    it("findById should err() when note does not exist", async () => {
      const missingId = randomUUID();
      const found = await noteDao.findById(missingId);

      expect(found.isErr()).toBe(true);
      expect(found._unsafeUnwrapErr()).not.toBeUndefined();
    });

    it("findAll should return notes from all workspaces", async () => {
      const anotherWorkspace = (
        await WorkspaceDAO(() => resolveTx(db)).create({
          name: "Another Workspace",
          createdAt: new Date(),
        })
      )._unsafeUnwrap();
      const noteInCurrentWorkspaceId = randomUUID();
      const noteInAnotherWorkspaceId = randomUUID();

      await createNote(noteInCurrentWorkspaceId);
      await saveNote({
        ...(await buildNote(noteInAnotherWorkspaceId)),
        workspaceId: anotherWorkspace.id,
      });

      const allIds = (await noteDao.findAll())._unsafeUnwrap().map((n) => n.id);

      expect(allIds).toContain(noteInCurrentWorkspaceId);
      expect(allIds).toContain(noteInAnotherWorkspaceId);
    });

    it("findAllByWorkspaceId should return only notes from the given workspace", async () => {
      const anotherWorkspace = (
        await WorkspaceDAO(() => resolveTx(db)).create({
          name: "Third Workspace",
          createdAt: new Date(),
        })
      )._unsafeUnwrap();
      const inTargetWorkspaceId = randomUUID();
      const outsideTargetWorkspaceId = randomUUID();

      await createNote(inTargetWorkspaceId);
      await saveNote({
        ...(await buildNote(outsideTargetWorkspaceId)),
        workspaceId: anotherWorkspace.id,
      });

      const notesInWorkspace = (
        await noteDao.findAllByWorkspaceId(workspaceId)
      )._unsafeUnwrap();
      const noteIds = notesInWorkspace.map((n) => n.id);

      expect(noteIds).toContain(inTargetWorkspaceId);
      expect(noteIds).not.toContain(outsideTargetWorkspaceId);
    });

    it("exists should return true for an existing note and false otherwise", async () => {
      const existingId = randomUUID();
      const missingId = randomUUID();
      await createNote(existingId);

      const existingResult = (await noteDao.exists(existingId))._unsafeUnwrap();
      const missingResult = (await noteDao.exists(missingId))._unsafeUnwrap();

      expect(existingResult).toBe(true);
      expect(missingResult).toBe(false);
    });
  });

  describe("findAllByParentId", () => {
    it("findAllByParentId should return only children of the given parent in the workspace", async () => {
      const parentId = randomUUID();
      const childAId = randomUUID();
      const childBId = randomUUID();
      const siblingWithDifferentParentId = randomUUID();

      await createNote(parentId);
      await createNote(childAId, parentId);
      await createNote(childBId, parentId);
      await createNote(siblingWithDifferentParentId);

      const children = await noteDao.findAllByParentId(workspaceId, parentId);
      const childIds = children._unsafeUnwrap().map((n) => n.id);

      expect(childIds).toContain(childAId);
      expect(childIds).toContain(childBId);
      expect(childIds).not.toContain(siblingWithDifferentParentId);
    });

    it("findAllByParentId should return root notes when parentId is null", async () => {
      const rootId = randomUUID();
      const parentId = randomUUID();
      const childId = randomUUID();

      await createNote(rootId);
      await createNote(parentId);
      await createNote(childId, parentId);

      const roots = await noteDao.findAllByParentId(workspaceId, null);
      const rootIds = roots._unsafeUnwrap().map((n) => n.id);

      expect(rootIds).toContain(rootId);
      expect(rootIds).toContain(parentId);
      expect(rootIds).not.toContain(childId);
    });
  });

  describe("findAllTrashed", () => {
    it("findAllTrashed should return trashed notes sorted by trashedAt ascending", async () => {
      const earlyDate = new Date("2024-01-01T00:00:00.000Z");
      const lateDate = new Date("2024-01-02T00:00:00.000Z");
      const firstExpectedId = randomUUID();
      const secondExpectedId = randomUUID();
      const notTrashedId = randomUUID();

      await saveNote({
        ...(await buildNote(secondExpectedId)),
        isTrashed: true,
        trashedAt: lateDate,
      });
      await saveNote({
        ...(await buildNote(firstExpectedId)),
        isTrashed: true,
        trashedAt: earlyDate,
      });
      await saveNote({
        ...(await buildNote(notTrashedId)),
        isTrashed: false,
      });

      const trashed = await noteDao.findAllTrashed(workspaceId);
      const trashedIds = trashed._unsafeUnwrap().map((n) => n.id);
      const expectedOrder = [firstExpectedId, secondExpectedId];

      expect(trashedIds).toEqual(expectedOrder);
      expect(trashedIds).not.toContain(notTrashedId);
    });
  });

  describe("deleteMany", () => {
    it("should delete multiple notes by their ids", async () => {
      const id1 = randomUUID();
      const id2 = randomUUID();
      const id3 = randomUUID();

      await createNote(id1);
      await createNote(id2);
      await createNote(id3);

      await noteDao.deleteMany([id1, id2]);

      expect((await noteDao.exists(id1))._unsafeUnwrap()).toBe(false);
      expect((await noteDao.exists(id2))._unsafeUnwrap()).toBe(false);
      expect((await noteDao.exists(id3))._unsafeUnwrap()).toBe(true);
    });

    it("should not throw when deleting non-existent ids", async () => {
      const existingId = randomUUID();
      await createNote(existingId);

      await expect(
        noteDao.deleteMany([randomUUID(), randomUUID()]),
      ).resolves.not.toThrow();

      expect((await noteDao.exists(existingId))._unsafeUnwrap()).toBe(true);
    });

    it("should handle a mix of existing and non-existent ids", async () => {
      const existingId = randomUUID();
      const survivorId = randomUUID();

      await createNote(existingId);
      await createNote(survivorId);

      await noteDao.deleteMany([existingId, randomUUID()]);

      expect((await noteDao.exists(existingId))._unsafeUnwrap()).toBe(false);
      expect((await noteDao.exists(survivorId))._unsafeUnwrap()).toBe(true);
    });

    it("should handle an empty array", async () => {
      const existingId = randomUUID();
      await createNote(existingId);

      await expect(noteDao.deleteMany([])).resolves.not.toThrow();

      expect((await noteDao.exists(existingId))._unsafeUnwrap()).toBe(true);
    });
  });

  describe("getAllDocumentsInDatabase, getAllDatabasesInWorkspace", () => {
    it("getAllDocumentsInDatabase should return only non-trashed documents under the given parent", async () => {
      const databaseId = randomUUID();
      const docId = randomUUID();
      const trashedDocId = randomUUID();
      const otherParentDocId = randomUUID();

      await createNote(databaseId);
      await saveNote({
        ...(await buildNote(docId, databaseId)),
        type: "doc",
      });
      await saveNote({
        ...(await buildNote(trashedDocId, databaseId)),
        type: "doc",
        isTrashed: true,
      });
      await saveNote({
        ...(await buildNote(otherParentDocId)),
        type: "doc",
      });

      const docs = (
        await noteDao.getAllDocumentsInDatabase(databaseId)
      )._unsafeUnwrap();
      const docIds = docs.map((n) => n.id);

      expect(docIds).toEqual([docId]);
      expect(docIds).not.toContain(trashedDocId);
      expect(docIds).not.toContain(otherParentDocId);
    });

    it("getAllDocumentsInDatabase should exclude non-document types", async () => {
      const databaseId = randomUUID();
      const docId = randomUUID();
      const databaseViewId = randomUUID();

      await createNote(databaseId);
      await saveNote({
        ...(await buildNote(docId, databaseId)),
        type: "doc",
      });
      await saveNote({
        ...(await buildNote(databaseViewId, databaseId)),
        type: "database_view",
      });

      const docs = (
        await noteDao.getAllDocumentsInDatabase(databaseId)
      )._unsafeUnwrap();
      const docIds = docs.map((n) => n.id);

      expect(docIds).toEqual([docId]);
      expect(docIds).not.toContain(databaseViewId);
    });

    it("getAllDocumentsInDatabase should return empty array when no documents exist", async () => {
      const databaseId = randomUUID();
      await createNote(databaseId);

      const docs = (
        await noteDao.getAllDocumentsInDatabase(databaseId)
      )._unsafeUnwrap();

      expect(docs).toEqual([]);
    });

    it("getAllDatabasesInWorkspace should return only non-trashed databases in the workspace", async () => {
      const databaseId = randomUUID();
      const trashedDatabaseId = randomUUID();
      const docId = randomUUID();

      await saveNote({
        ...(await buildNote(databaseId)),
        type: "database",
      });
      await saveNote({
        ...(await buildNote(trashedDatabaseId)),
        type: "database",
        isTrashed: true,
      });
      await createNote(docId);

      const databases = (
        await noteDao.getAllDatabasesInWorkspace(workspaceId)
      )._unsafeUnwrap();
      const dbIds = databases.map((n) => n.id);

      expect(dbIds).toEqual([databaseId]);
      expect(dbIds).not.toContain(trashedDatabaseId);
      expect(dbIds).not.toContain(docId);
    });

    it("getAllDatabasesInWorkspace should exclude databases from other workspaces", async () => {
      const otherWorkspace = (
        await WorkspaceDAO(() => resolveTx(db)).create({
          name: "Other Workspace",
          createdAt: new Date(),
        })
      )._unsafeUnwrap();
      const localDbId = randomUUID();
      const otherDbId = randomUUID();

      await saveNote({
        ...(await buildNote(localDbId)),
        type: "database",
      });
      await saveNote({
        ...(await buildNote(otherDbId)),
        workspaceId: otherWorkspace.id,
        type: "database",
      });

      const databases = (
        await noteDao.getAllDatabasesInWorkspace(workspaceId)
      )._unsafeUnwrap();
      const dbIds = databases.map((n) => n.id);

      expect(dbIds).toContain(localDbId);
      expect(dbIds).not.toContain(otherDbId);
    });

    it("getAllDatabasesInWorkspace should return empty array when no databases exist", async () => {
      const databases = (
        await noteDao.getAllDatabasesInWorkspace(workspaceId)
      )._unsafeUnwrap();

      expect(databases).toEqual([]);
    });
  });

  describe("isDescendant", () => {
    it("should return 'CIRCULAR' when target is the parent (self-descendant check)", async () => {
      // Logic: if (targetId === potentialParentId) return true;
      const res = await noteDao.isDescendant("note1", "note1");
      expect(res._unsafeUnwrap()).toBe("CIRCULAR");
    });

    it("should return true when target is a direct child", async () => {
      await createNote("parent");
      await createNote("child", "parent");
      const res = await noteDao.isDescendant("child", "parent");
      expect(res._unsafeUnwrap()).toBe(true);
    });

    it("should return true when target is a grandchild", async () => {
      await createNote("root");
      await createNote("child", "root");
      await createNote("grandchild", "child");
      const res = await noteDao.isDescendant("grandchild", "root");
      expect(res._unsafeUnwrap()).toBe(true);
    });

    it("should return false when target is the parent of potentialParentId (ancestor)", async () => {
      await createNote("parent");
      await createNote("child", "parent");
      const res = await noteDao.isDescendant("parent", "child");
      expect(res._unsafeUnwrap()).toBe(false);
    });

    it("should return false when notes are siblings", async () => {
      await createNote("root");
      await createNote("child1", "root");
      await createNote("child2", "root");
      const res = await noteDao.isDescendant("child1", "child2");
      expect(res._unsafeUnwrap()).toBe(false);
    });

    it("should return false when notes are unrelated", async () => {
      await createNote("note1");
      await createNote("note2");
      const res = await noteDao.isDescendant("note1", "note2");
      expect(res._unsafeUnwrap()).toBe(false);
    });

    it("should return false when targetId or potentialParentId is null", async () => {
      expect((await noteDao.isDescendant(null, "someId"))._unsafeUnwrap()).toBe(
        false,
      );
      expect((await noteDao.isDescendant("someId", null))._unsafeUnwrap()).toBe(
        false,
      );
      expect((await noteDao.isDescendant(null, null))._unsafeUnwrap()).toBe(
        false,
      );
    });

    it("should handle circular references gracefully", async () => {
      // Create a cycle: A -> B -> A
      await createNote("A");
      await createNote("B", "A");

      const noteA = (await noteDao.findById("A"))._unsafeUnwrap();
      await noteDao.update({ id: noteA.id, parentId: "B" });

      // Test checking against an unrelated node C
      await createNote("C");
      const res = await noteDao.isDescendant("A", "C");
      expect(res._unsafeUnwrap()).toBe(false);
    });
  });
});
