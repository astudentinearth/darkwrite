import { randomUUID } from "node:crypto";
import { type ParentId, Rank } from "@darkwrite/common";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  applySqlMigrations,
  createTestDatabase,
  type DatabaseType,
} from "@/db";
import {
  type NewNoteRow,
  type NoteRow,
  note as notesTable,
  type WorkspaceRow,
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

    const workspace: WorkspaceRow = (
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
  ): Promise<NoteRow> => {
    return {
      id,
      title: `Test Note${id}`,
      workspaceId: workspaceId,
      parentId,
      orderHint: Rank.default().get(),
      favoriteOrderHint: Rank.default().get(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      icon: null,
      isFavorite: false,
      isTrashed: null,
      trashedAt: null,
      properties: {},
    };
  };

  const saveNote = async (note: NewNoteRow) => await noteDao.create(note);
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
});
