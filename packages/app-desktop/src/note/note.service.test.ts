import { type ParentId, Rank } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  type NewNoteRow,
  type NoteRow,
  note as notesTable,
  type Workspace,
} from "@/db/schema";
import { resolveTx } from "@/db/transactional";
import { DocumentService } from "@/service/document.service";
import { MockDocumentStore } from "@/test/mocks/document-store.mock";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import {
  applySqlMigrations,
  createTestDatabase,
  type DatabaseType,
} from "../db";
import { NoteDAO, type NoteDAOInstance } from "./note.dao";
import { type INoteService, NoteService } from "./note.service";

describe("note service tests", () => {
  const db: DatabaseType = createTestDatabase();
  let workspace: Workspace;
  let noteDAO: NoteDAOInstance;
  let noteService: INoteService;
  const documentStore = MockDocumentStore();

  beforeAll(async () => {
    await applySqlMigrations(db);
    noteDAO = NoteDAO(() => resolveTx(db));
    noteService = NoteService(db, DocumentService(documentStore));
    workspace = (
      await WorkspaceDAO(() => resolveTx(db)).create({
        name: "Test Workspace",
        createdAt: new Date(),
      })
    )._unsafeUnwrap();
  });
  beforeEach(async () => {
    await db.delete(notesTable);
    await documentStore
      .ls()
      .andThen((docs) =>
        ResultAsync.combine(docs.map((id) => documentStore.delete(id))),
      );
  });

  async function createNote(
    title: string,
    orderHint: string,
    parentId: ParentId = null,
  ): Promise<NoteRow> {
    const note: NewNoteRow = {
      title,
      workspaceId: workspace.id,
      orderHint,
      favoriteOrderHint: "",
      parentId,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    return (await noteDAO.create(note))._unsafeUnwrap();
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

      expect(
        (await noteDAO.findById(note1.id))._unsafeUnwrapErr(),
      ).toBeDefined();
      expect(
        (await noteDAO.findById(note2.id))._unsafeUnwrapErr(),
      ).toBeDefined();
    });

    it("should not touch notes in a different workspace", async () => {
      const otherWorkspace = (
        await WorkspaceDAO(() => resolveTx(db)).create({
          name: "Other Workspace",
          createdAt: new Date(),
        })
      )._unsafeUnwrap();

      const rankA = Rank.default().get();
      const trashedInOther: NewNoteRow = {
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
      const saved = (await noteDAO.create(trashedInOther))._unsafeUnwrap();

      const localNote = await createNote("Local trashed", rankA);
      await noteService.moveToTrash(localNote.id);

      await noteService.emptyTrash(workspace.id);

      expect(
        (await noteDAO.findById(saved.id))._unsafeUnwrap(),
      ).not.toBeUndefined();
      expect(
        (await noteDAO.findById(localNote.id))._unsafeUnwrapErr(),
      ).toBeDefined();
    });

    it("should not touch notes that are not trashed", async () => {
      const rankA = Rank.default().get();
      const rankB = new Rank(rankA).next().get();

      const alive = await createNote("Alive", rankA);
      const trashed = await createNote("Trashed", rankB);
      await noteService.moveToTrash(trashed.id);

      await noteService.emptyTrash(workspace.id);

      expect(
        (await noteDAO.findById(alive.id))._unsafeUnwrap(),
      ).not.toBeUndefined();
      expect(
        (await noteDAO.findById(trashed.id))._unsafeUnwrapErr(),
      ).toBeDefined();
    });

    it("should delete document content for trashed notes", async () => {
      const note = (
        await noteService.create({
          title: "With content",
          workspaceId: workspace.id,
          parentId: null,
        })
      )._unsafeUnwrap();

      expect((await documentStore.exists(note.id))._unsafeUnwrap()).toBe(true);

      await noteService.moveToTrash(note.id);
      await noteService.emptyTrash(workspace.id);

      expect((await documentStore.exists(note.id))._unsafeUnwrap()).toBe(false);
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
      await noteService.move({
        destinationId: noteA.id,
        sourceId: source.id,
        placement: "below",
      });

      // Assert
      const updatedSource = (await noteDAO.findById(source.id))._unsafeUnwrap();
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
      await noteService.move({
        sourceId: source.id,
        destinationId: noteA.id,
        placement: "below",
      });

      // Assert
      const updatedSource = (await noteDAO.findById(source.id))._unsafeUnwrap();
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
      await noteService.move({
        placement: "inside-start",
        sourceId: source.id,
        destinationId: parent.id,
      });

      // Assert
      const updatedSource = (await noteDAO.findById(source.id))._unsafeUnwrap();
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
      await noteService.move({
        placement: "inside-start",
        sourceId: source.id,
        destinationId: parent.id,
      });

      // Assert
      const updatedSource = (await noteDAO.findById(source.id))._unsafeUnwrap();
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
      await noteService.move({
        placement: "inside-end",
        sourceId: source.id,
        destinationId: parent.id,
      });

      // Assert
      const updatedSource = (await noteDAO.findById(source.id))._unsafeUnwrap();
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
      await noteService.move({
        placement: "inside-end",
        sourceId: source.id,
        destinationId: parent.id,
      });

      // Assert
      const updatedSource = (await noteDAO.findById(source.id))._unsafeUnwrap();
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
      await noteService.move({
        placement: "inside-end",
        sourceId: source.id,
        destinationId: null,
      }); // Move to root

      // Assert
      const updatedSource = (await noteDAO.findById(source.id))._unsafeUnwrap();
      expect(updatedSource.parentId).toBeNull();
      expect(updatedSource.orderHint > rootNote.orderHint).toBe(true);
    });
  });
});
