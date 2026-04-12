import { createTestDatabase, DatabaseType, migrateDatabase } from "@/db";
import { NewNote, Note, note as notesTable, Workspace } from "@/db/schema";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { ParentId, Rank } from "@darkwrite/common";
import { randomUUID } from "crypto";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { NoteDAO } from "./note.dao";

let db: DatabaseType = createTestDatabase();

describe("NoteDAO", () => {
  let noteDao: NoteDAO;
  let workspaceId = "";

  beforeAll(async () => {
    await migrateDatabase(db);
    noteDao = new NoteDAO(db);

    const workspace: Workspace = await new WorkspaceDAO(db).create({
      name: "Test Workspace",
      createdAt: new Date(),
    });

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
      isTrashed: null,
      trashedAt: null,
    };
  };

  const saveNote = async (note: NewNote) => await noteDao.create(note);
  const createNote = async (id: string, parentId: ParentId = null) =>
    await saveNote(await buildNote(id, parentId));

  describe("create", () => {
    it("should create notes without id", async () => {
      const note = await noteDao.create({
        workspaceId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        favoriteOrderHint: "",
        orderHint: "",
        title: "New note",
      });
      expect(note).not.toBeNull();
      expect(note.title).toBe("New note");
      expect(note.id).not.toBeNull();
    });

    it("should create notes with id", async () => {
      const id = randomUUID();
      const note = await noteDao.create({
        id,
        workspaceId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        favoriteOrderHint: "",
        orderHint: "",
        title: "New note",
      });
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
      const updated = await noteDao.update({
        id: note.id,
        title: "Updated title",
      });
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
      expect(updated).toBeUndefined();
    });

    it("should update multiple notes", async () => {
      const note1 = await createNote(randomUUID());
      const note2 = await createNote(randomUUID());

      const updatedNotes = await noteDao.updateAll([
        { id: note1.id, title: "trashed", isTrashed: true },
        { id: note2.id, title: "favorite", isFavorite: true },
      ]);

      const updated1 = updatedNotes.find((n) => n.id == note1.id);
      const updated2 = updatedNotes.find((n) => n.id == note2.id);

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

      const found = await noteDao.findById(noteId);

      expect(found).not.toBeUndefined();
      expect(found?.id).toBe(saved.id);
    });

    it("findById should return undefined when note does not exist", async () => {
      const missingId = randomUUID();
      const found = await noteDao.findById(missingId);

      expect(found).toBeUndefined();
    });

    it("findByIdOrThrow should return the note when it exists", async () => {
      const noteId = randomUUID();
      const saved = await createNote(noteId);

      const found = await noteDao.findByIdOrThrow(noteId);

      expect(found.id).toBe(saved.id);
    });

    it("findByIdOrThrow should throw when note does not exist", async () => {
      const missingId = randomUUID();

      await expect(noteDao.findByIdOrThrow(missingId)).rejects.toThrow();
    });

    it("findAll should return notes from all workspaces", async () => {
      const anotherWorkspace = await new WorkspaceDAO(db).create({
        name: "Another Workspace",
        createdAt: new Date(),
      });
      const noteInCurrentWorkspaceId = randomUUID();
      const noteInAnotherWorkspaceId = randomUUID();

      await createNote(noteInCurrentWorkspaceId);
      await saveNote({
        ...(await buildNote(noteInAnotherWorkspaceId)),
        workspaceId: anotherWorkspace.id,
      });

      const allNotes = await noteDao.findAll();
      const allIds = allNotes.map((n) => n.id);

      expect(allIds).toContain(noteInCurrentWorkspaceId);
      expect(allIds).toContain(noteInAnotherWorkspaceId);
    });

    it("findAllByWorkspaceId should return only notes from the given workspace", async () => {
      const anotherWorkspace = await new WorkspaceDAO(db).create({
        name: "Third Workspace",
        createdAt: new Date(),
      });
      const inTargetWorkspaceId = randomUUID();
      const outsideTargetWorkspaceId = randomUUID();

      await createNote(inTargetWorkspaceId);
      await saveNote({
        ...(await buildNote(outsideTargetWorkspaceId)),
        workspaceId: anotherWorkspace.id,
      });

      const notesInWorkspace = await noteDao.findAllByWorkspaceId(workspaceId);
      const noteIds = notesInWorkspace.map((n) => n.id);

      expect(noteIds).toContain(inTargetWorkspaceId);
      expect(noteIds).not.toContain(outsideTargetWorkspaceId);
    });

    it("exists should return true for an existing note and false otherwise", async () => {
      const existingId = randomUUID();
      const missingId = randomUUID();
      await createNote(existingId);

      const existingResult = await noteDao.exists(existingId);
      const missingResult = await noteDao.exists(missingId);

      expect(existingResult).toBe(true);
      expect(missingResult).toBe(false);
    });
  });

  describe("findAllByParentId, findAllByParentIdSortAsc", () => {
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
      const childIds = children.map((n) => n.id);

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
      const rootIds = roots.map((n) => n.id);

      expect(rootIds).toContain(rootId);
      expect(rootIds).toContain(parentId);
      expect(rootIds).not.toContain(childId);
    });

    it("findAllByParentIdSortAsc should sort children by orderHint ascending", async () => {
      const parentId = randomUUID();
      await createNote(parentId);

      const firstRank = Rank.default();
      const secondRank = firstRank.next();
      const thirdRank = secondRank.next();

      const firstId = randomUUID();
      const secondId = randomUUID();
      const thirdId = randomUUID();

      await saveNote({
        ...(await buildNote(secondId, parentId)),
        orderHint: secondRank.get(),
      });
      await saveNote({
        ...(await buildNote(thirdId, parentId)),
        orderHint: thirdRank.get(),
      });
      await saveNote({
        ...(await buildNote(firstId, parentId)),
        orderHint: firstRank.get(),
      });

      const sorted = await noteDao.findAllByParentIdSortAsc(
        workspaceId,
        parentId,
      );
      const sortedIds = sorted.map((n) => n.id);
      const expectedOrder = [firstId, secondId, thirdId];

      expect(sortedIds).toEqual(expectedOrder);
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

      const first = await noteDao.findFirstNoteInLayer(workspaceId, parentId);

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

      const last = await noteDao.findLastNoteInLayer(workspaceId, parentId);

      expect(last).not.toBeUndefined();
      expect(last?.id).toBe(expectedLastId);
    });

    it("findLastNoteInFavorites should return the favorite with highest favoriteOrderHint and not trashed", async () => {
      const firstFavoriteRank = Rank.default();
      const secondFavoriteRank = firstFavoriteRank.next();
      const thirdFavoriteRank = secondFavoriteRank.next();

      const expectedId = randomUUID();
      const trashedHighestFavoriteId = randomUUID();

      await saveNote({
        ...(await buildNote(randomUUID())),
        isFavorite: true,
        favoriteOrderHint: firstFavoriteRank.get(),
      });
      await saveNote({
        ...(await buildNote(expectedId)),
        isFavorite: true,
        favoriteOrderHint: secondFavoriteRank.get(),
      });
      await saveNote({
        ...(await buildNote(trashedHighestFavoriteId)),
        isFavorite: true,
        isTrashed: true,
        favoriteOrderHint: thirdFavoriteRank.get(),
      });

      const lastFavorite = await noteDao.findLastNoteInFavorites(workspaceId);

      expect(lastFavorite).not.toBeUndefined();
      expect(lastFavorite?.id).toBe(expectedId);
    });
  });

  describe("findAllFavorites, findAllTrashed", () => {
    it("findAllFavorites should return only non-trashed favorites sorted ascending", async () => {
      const lowRank = Rank.default();
      const highRank = lowRank.next();

      const firstExpectedId = randomUUID();
      const secondExpectedId = randomUUID();
      const notFavoriteId = randomUUID();
      const trashedFavoriteId = randomUUID();

      await saveNote({
        ...(await buildNote(secondExpectedId)),
        isFavorite: true,
        favoriteOrderHint: highRank.get(),
      });
      await saveNote({
        ...(await buildNote(firstExpectedId)),
        isFavorite: true,
        favoriteOrderHint: lowRank.get(),
      });
      await saveNote({
        ...(await buildNote(notFavoriteId)),
        isFavorite: false,
      });
      await saveNote({
        ...(await buildNote(trashedFavoriteId)),
        isFavorite: true,
        isTrashed: true,
      });

      const favorites = await noteDao.findAllFavorites(workspaceId);
      const favoriteIds = favorites.map((n) => n.id);
      const expectedOrder = [firstExpectedId, secondExpectedId];

      expect(favoriteIds).toEqual(expectedOrder);
      expect(favoriteIds).not.toContain(notFavoriteId);
      expect(favoriteIds).not.toContain(trashedFavoriteId);
    });

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
      const trashedIds = trashed.map((n) => n.id);
      const expectedOrder = [firstExpectedId, secondExpectedId];

      expect(trashedIds).toEqual(expectedOrder);
      expect(trashedIds).not.toContain(notTrashedId);
    });
  });

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
        await noteDao.update({ id: noteA.id, parentId: "B" });
      }

      // Test checking against an unrelated node C
      await createNote("C");
      const res = await noteDao.isDescendant("A", "C");
      expect(res).toBe(false);
    });
  });
});
