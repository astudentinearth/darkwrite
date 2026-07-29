import { randomUUID } from "node:crypto";
import { type ParentId, Rank } from "@darkwrite/common";
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
      orderHint: Rank.default().get(),
      favoriteOrderHint: Rank.default().get(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      userId: null,
      propertyValues: null,
      databaseId: null,
      icon: null,
      isFavorite: false,
      isTrashed: null,
      trashedAt: null,
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
        favoriteOrderHint: "",
        orderHint: "",
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
        favoriteOrderHint: "",
        orderHint: "",
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
          { id: note2.id, title: "favorite", isFavorite: true },
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
      expect(updated2?.isFavorite).toBeTruthy();
      expect(updated2?.title).toBe("favorite");
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

  describe("findFirstNoteInLayer, findLastNoteInLayer, findLastNoteInFavorites", () => {
    it("findFirstNoteInLayer should return the smallest orderHint among non-trashed notes", async () => {
      const parentId = randomUUID();
      await createNote(parentId);

      const smallestRank = Rank.default();
      const middleRank = smallestRank.next();
      const largestRank = middleRank.next();

      const firstExpectedId = randomUUID();
      const trashedSmallerId = randomUUID();
      const otherId = randomUUID();

      await saveNote({
        ...(await buildNote(firstExpectedId, parentId)),
        orderHint: smallestRank.get(),
      });
      await saveNote({
        ...(await buildNote(trashedSmallerId, parentId)),
        orderHint: new Rank(smallestRank.get()).prev().get(),
        isTrashed: true,
      });
      await saveNote({
        ...(await buildNote(otherId, parentId)),
        orderHint: largestRank.get(),
      });

      const first = (
        await noteDao.findFirstNoteInLayer(workspaceId, parentId)
      )._unsafeUnwrap();

      expect(first).not.toBeUndefined();
      expect(first?.id).toBe(firstExpectedId);
    });

    it("findLastNoteInLayer should return the greatest orderHint among non-trashed notes", async () => {
      const parentId = randomUUID();
      await createNote(parentId);

      const firstRank = Rank.default();
      const secondRank = firstRank.next();
      const thirdRank = secondRank.next();

      const expectedLastId = randomUUID();
      const trashedLargestId = randomUUID();

      await saveNote({
        ...(await buildNote(randomUUID(), parentId)),
        orderHint: firstRank.get(),
      });
      await saveNote({
        ...(await buildNote(expectedLastId, parentId)),
        orderHint: thirdRank.get(),
      });
      await saveNote({
        ...(await buildNote(trashedLargestId, parentId)),
        orderHint: new Rank(thirdRank.get()).next().get(),
        isTrashed: true,
      });

      const last = (
        await noteDao.findLastNoteInLayer(workspaceId, parentId)
      )._unsafeUnwrap();

      expect(last).not.toBeUndefined();
      expect(last?.id).toBe(expectedLastId);
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

  describe("noteRightAfter", () => {
    it("should return the note with the next greater orderHint", async () => {
      const firstRank = Rank.default();
      const secondRank = firstRank.next();
      const thirdRank = secondRank.next();

      const firstId = randomUUID();
      const secondId = randomUUID();
      const thirdId = randomUUID();

      await saveNote({
        ...(await buildNote(firstId)),
        orderHint: firstRank.get(),
      });
      await saveNote({
        ...(await buildNote(secondId)),
        orderHint: secondRank.get(),
      });
      await saveNote({
        ...(await buildNote(thirdId)),
        orderHint: thirdRank.get(),
      });

      const result = (
        await noteDao.noteRightAfter(firstId, workspaceId)
      )._unsafeUnwrap();

      expect(result).not.toBeUndefined();
      expect(result?.id).toBe(secondId);
    });

    it("should return only the immediately next note, not all subsequent ones", async () => {
      const firstRank = Rank.default();
      const secondRank = firstRank.next();
      const thirdRank = secondRank.next();

      const firstId = randomUUID();
      const secondId = randomUUID();
      const thirdId = randomUUID();

      await saveNote({
        ...(await buildNote(firstId)),
        orderHint: firstRank.get(),
      });
      await saveNote({
        ...(await buildNote(secondId)),
        orderHint: secondRank.get(),
      });
      await saveNote({
        ...(await buildNote(thirdId)),
        orderHint: thirdRank.get(),
      });

      const result = (
        await noteDao.noteRightAfter(firstId, workspaceId)
      )._unsafeUnwrap();

      expect(result?.id).toBe(secondId);
      expect(result?.id).not.toBe(thirdId);
    });

    it("should return undefined when the target is the last note", async () => {
      const firstRank = Rank.default();
      const secondRank = firstRank.next();

      const firstId = randomUUID();
      const lastId = randomUUID();

      await saveNote({
        ...(await buildNote(firstId)),
        orderHint: firstRank.get(),
      });
      await saveNote({
        ...(await buildNote(lastId)),
        orderHint: secondRank.get(),
      });

      const result = (
        await noteDao.noteRightAfter(lastId, workspaceId)
      )._unsafeUnwrap();

      expect(result).toBeUndefined();
    });

    it("should return undefined when the target does not exist", async () => {
      const someId = randomUUID();
      await saveNote({
        ...(await buildNote(randomUUID())),
        orderHint: Rank.default().get(),
      });

      const result = (
        await noteDao.noteRightAfter(someId, workspaceId)
      )._unsafeUnwrap();

      expect(result).toBeUndefined();
    });

    it("should use favoriteOrderHint when specified", async () => {
      const firstRank = Rank.default();
      const secondRank = firstRank.next();
      const thirdRank = secondRank.next();

      const firstId = randomUUID();
      const secondId = randomUUID();
      const thirdId = randomUUID();

      await saveNote({
        ...(await buildNote(firstId)),
        favoriteOrderHint: firstRank.get(),
        orderHint: thirdRank.get(),
      });
      await saveNote({
        ...(await buildNote(secondId)),
        favoriteOrderHint: secondRank.get(),
        orderHint: secondRank.get(),
      });
      await saveNote({
        ...(await buildNote(thirdId)),
        favoriteOrderHint: thirdRank.get(),
        orderHint: firstRank.get(),
      });

      const result = (
        await noteDao.noteRightAfter(firstId, workspaceId, "favoriteOrderHint")
      )._unsafeUnwrap();

      expect(result).not.toBeUndefined();
      expect(result?.id).toBe(secondId);
    });

    it("should not return notes from another workspace", async () => {
      const otherWorkspace = (
        await WorkspaceDAO(() => resolveTx(db)).create({
          name: "Other Workspace",
          createdAt: new Date(),
        })
      )._unsafeUnwrap();

      const firstRank = Rank.default();
      const secondRank = firstRank.next();

      const targetId = randomUUID();
      const otherWorkspaceNoteId = randomUUID();

      await saveNote({
        ...(await buildNote(targetId)),
        orderHint: firstRank.get(),
      });
      // A note in another workspace with a higher orderHint
      await saveNote({
        ...(await buildNote(otherWorkspaceNoteId)),
        workspaceId: otherWorkspace.id,
        orderHint: secondRank.get(),
      });

      const result = (
        await noteDao.noteRightAfter(targetId, workspaceId)
      )._unsafeUnwrap();

      expect(result).toBeUndefined();
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
