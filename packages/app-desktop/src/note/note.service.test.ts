import { NewNote, Note, note as notesTable, Workspace } from "@/db/schema";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { ParentId, Rank } from "@darkwrite/common";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestDatabase, DatabaseType, applySqlMigrations } from "../db";
import { NoteDAO } from "./note.dao";
import { NoteService } from "./note.service";
import { DocumentService } from "@/service/document.service";
import { MockDocumentStore } from "@/test/mocks/document-store.mock";

describe("note service tests", () => {
  let db: DatabaseType = createTestDatabase();
  let workspace: Workspace;
  let noteDAO: NoteDAO;
  let noteService: NoteService;
  let documentStore = new MockDocumentStore();

  beforeAll(async () => {
    await applySqlMigrations(db);
    noteDAO = new NoteDAO(db);
    noteService = new NoteService(db, new DocumentService(documentStore));
    workspace = await new WorkspaceDAO(db).create({
      name: "Test Workspace",
      createdAt: new Date(),
    });
  });
  beforeEach(async () => {
    await db.delete(notesTable);
    await Promise.all(
      (await documentStore.ls()).map((docId) => documentStore.delete(docId)),
    );
  });

  async function createNote(
    title: string,
    orderHint: string,
    parentId: ParentId = null,
  ): Promise<Note> {
    const note: NewNote = {
      title,
      workspaceId: workspace.id,
      orderHint,
      favoriteOrderHint: "",
      parentId,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    return await noteDAO.create(note);
  }

  describe("clear trash tests", () => {
    it("should clear all trashed notes in the workspace", async () => {
      const rankA = Rank.default().get();
      const rankB = new Rank(rankA).next().get();

      const note1 = await createNote("Trashed 1", rankA);
      const note2 = await createNote("Trashed 2", rankB);

      await noteService.moveToTrash(note1.id);
      await noteService.moveToTrash(note2.id);

      await noteService.emptyTrash(workspace.id);

      expect(await noteDAO.findById(note1.id)).toBeUndefined();
      expect(await noteDAO.findById(note2.id)).toBeUndefined();
    });

    it("should not touch notes in a different workspace", async () => {
      const otherWorkspace = await new WorkspaceDAO(db).create({
        name: "Other Workspace",
        createdAt: new Date(),
      });

      const rankA = Rank.default().get();
      const trashedInOther: NewNote = {
        title: "Trashed in other",
        workspaceId: otherWorkspace.id,
        orderHint: "",
        favoriteOrderHint: "",
        parentId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isTrashed: true,
        trashedAt: new Date(),
      };
      const saved = await noteDAO.create(trashedInOther);

      const localNote = await createNote("Local trashed", rankA);
      await noteService.moveToTrash(localNote.id);

      await noteService.emptyTrash(workspace.id);

      expect(await noteDAO.findById(saved.id)).not.toBeUndefined();
      expect(await noteDAO.findById(localNote.id)).toBeUndefined();
    });

    it("should not touch notes that are not trashed", async () => {
      const rankA = Rank.default().get();
      const rankB = new Rank(rankA).next().get();

      const alive = await createNote("Alive", rankA);
      const trashed = await createNote("Trashed", rankB);
      await noteService.moveToTrash(trashed.id);

      await noteService.emptyTrash(workspace.id);

      expect(await noteDAO.findById(alive.id)).not.toBeUndefined();
      expect(await noteDAO.findById(trashed.id)).toBeUndefined();
    });

    it("should delete document content for trashed notes", async () => {
      const note = await noteService.create({
        title: "With content",
        workspaceId: workspace.id,
        parentId: null,
      });

      expect(await documentStore.exists(note.id)).toBe(true);

      await noteService.moveToTrash(note.id);
      await noteService.emptyTrash(workspace.id);

      expect(await documentStore.exists(note.id)).toBe(false);
    });

    it("should handle empty trash gracefully", async () => {
      await expect(noteService.emptyTrash(workspace.id)).resolves.not.toThrow();
    });
  });

  describe("moveInto and moveBelow tests", () => {
    it("moveBelow should move source note below target note and update rank", async () => {
      // Arrange
      const rankA = Rank.default().get();
      const rankC = new Rank(rankA).next().get(); // Note C is after A
      // We want rankC > rankA, which next() guarantees.

      const parent = await createNote("Parent", rankA);
      const noteA = await createNote("Note A", rankA, parent.id);
      const noteC = await createNote("Note C", rankC, parent.id);

      const rankX = new Rank(rankC).next().get(); // Source is somewhere else
      const source = await createNote("Source", rankX, null);

      // Act: Move Source below Note A
      await noteService.moveBelow(source.id, noteA.id);

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBe(parent.id);
      expect(updatedSource.orderHint > noteA.orderHint).toBe(true);
      expect(updatedSource.orderHint < noteC.orderHint).toBe(true);
    });

    it("moveBelow should move source note to end if no next sibling", async () => {
      // Arrange
      const rankA = Rank.default().get();
      const parent = await createNote("Parent", rankA);
      const noteA = await createNote("Note A", rankA, parent.id);
      // No next sibling
      const rankX = new Rank(rankA).next().get();
      const source = await createNote("Source", rankX, null);

      // Act
      await noteService.moveBelow(source.id, noteA.id);

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBe(parent.id);
      expect(updatedSource.orderHint > noteA.orderHint).toBe(true);
    });

    it("moveInto 'start' should move source to start of destination", async () => {
      // Arrange
      const rankA = Rank.default().get();
      const rankB = new Rank(rankA).next().get();

      const parent = await createNote("Parent", rankA);
      const child1 = await createNote("Child 1", rankB, parent.id);

      const rankX = new Rank(rankB).next().get();
      const source = await createNote("Source", rankX, null);

      // Act
      await noteService.moveInto(source.id, parent.id, "start");

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBe(parent.id);
      expect(updatedSource.orderHint < child1.orderHint).toBe(true);
    });

    it("moveInto 'start' on empty parent should use default rank", async () => {
      // Arrange
      const rankA = Rank.default().get();
      const parent = await createNote("Parent", rankA);

      const rankX = new Rank(rankA).next().get();
      const source = await createNote("Source", rankX, null);

      // Act
      await noteService.moveInto(source.id, parent.id, "start");

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBe(parent.id);
      // Should be roughly equal to default, or valid.
      // Rank.default().get() is what the service uses.
      expect(updatedSource.orderHint).toBe(Rank.default().get());
    });

    it("moveInto 'end' should move source to end of destination", async () => {
      // Arrange
      const rankA = Rank.default().get();
      const rankB = new Rank(rankA).next().get();

      const parent = await createNote("Parent", rankA);
      const child1 = await createNote("Child 1", rankB, parent.id);

      const rankX = new Rank(rankB).next().get();
      const source = await createNote("Source", rankX, null);

      // Act
      await noteService.moveInto(source.id, parent.id, "end");

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBe(parent.id);
      expect(updatedSource.orderHint > child1.orderHint).toBe(true);
    });

    it("moveInto 'end' on empty parent should use default rank", async () => {
      // Arrange
      const rankA = Rank.default().get();
      const parent = await createNote("Parent", rankA);

      const rankX = new Rank(rankA).next().get();
      const source = await createNote("Source", rankX, null);

      // Act
      await noteService.moveInto(source.id, parent.id, "end");

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBe(parent.id);
      expect(updatedSource.orderHint).toBe(Rank.default().get());
    });

    it("moveInto with null destination (root) should work", async () => {
      // Arrange
      const rankA = Rank.default().get();
      const rootNote = await createNote("Root Note", rankA, null);

      const rankX = new Rank(rankA).next().get();
      const source = await createNote("Source", rankX, "some-other-id");

      // Act
      await noteService.moveInto(source.id, null, "end"); // Move to root

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBeNull();
      expect(updatedSource.orderHint > rootNote.orderHint).toBe(true);
    });
  });
});
