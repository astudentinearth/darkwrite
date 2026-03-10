import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import { NoteService } from "./note.service";
import { AppDataSource } from "../db";
import { Note, Workspace } from "../entity";
import { Rank } from "@darkwrite/common";
import { NoteDAO } from "./note.dao";

describe("note service tests", () => {
  let workspace: Workspace;
  const noteDAO = new NoteDAO();

  beforeAll(async () => {
    await AppDataSource.initialize();
    const workspaceRepo = AppDataSource.getRepository(Workspace);
    workspace = new Workspace();
    workspace.name = "Test Workspace";
    workspace.created_at = new Date();
    workspace = await workspaceRepo.save(workspace);
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    const noteRepo = AppDataSource.getRepository(Note);
    await noteRepo.clear();
  });

  async function createNote(
    title: string,
    orderHint: string,
    parentId: string | null = null,
  ) {
    const note = new Note();
    note.title = title;
    note.workspace = workspace;
    note.orderHint = orderHint;
    note.favoriteOrderHint = "";
    note.parentId = parentId;
    return await noteDAO.save(note);
  }

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
      await NoteService.moveBelow(source.id, noteA.id);

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
      await NoteService.moveBelow(source.id, noteA.id);

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
      await NoteService.moveInto(source.id, parent.id, "start");

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
      await NoteService.moveInto(source.id, parent.id, "start");

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
      await NoteService.moveInto(source.id, parent.id, "end");

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
      await NoteService.moveInto(source.id, parent.id, "end");

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
      await NoteService.moveInto(source.id, null, "end"); // Move to root

      // Assert
      const updatedSource = await noteDAO.findByIdOrThrow(source.id);
      expect(updatedSource.parentId).toBeNull();
      expect(updatedSource.orderHint > rootNote.orderHint).toBe(true);
    });
  });
});
