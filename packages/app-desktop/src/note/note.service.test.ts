import { type Note, type ParentId, Rank } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  type NewNoteRow,
  type NoteRow,
  note as notesTable,
  type WorkspaceRow,
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
  let workspace: WorkspaceRow;
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

  /**
   * Trashes a note through the same write-through path the renderer uses
   * (moveToTrash/restoreFromTrash were removed; trashing is now a patch).
   */
  const trash = (id: string) =>
    noteService.patchAll([
      { id, isTrashed: true, trashedAt: new Date().toISOString() },
    ]);

  describe("clear trash tests", () => {
    it("should clear all trashed notes in the workspace", async () => {
      const rankA = Rank.default().get();
      const rankB = new Rank(rankA).next().get();

      const note1 = await createNote("Trashed 1", rankA);
      const note2 = await createNote("Trashed 2", rankB);

      await trash(note1.id);
      await trash(note2.id);

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
      await trash(localNote.id);

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
      await trash(trashed.id);

      await noteService.emptyTrash(workspace.id);

      expect(
        (await noteDAO.findById(alive.id))._unsafeUnwrap(),
      ).not.toBeUndefined();
      expect(
        (await noteDAO.findById(trashed.id))._unsafeUnwrapErr(),
      ).toBeDefined();
    });

    it("should delete document content for trashed notes", async () => {
      const now = new Date().toISOString();
      const note: Note = {
        id: crypto.randomUUID(),
        title: "With content",
        icon: null,
        parentId: null,
        workspaceId: workspace.id,
        orderHint: Rank.default().get(),
        favoriteOrderHint: "",
        isFavorite: false,
        isTrashed: false,
        trashedAt: null,
        createdAt: now,
        modifiedAt: now,
        properties: {},
        propertyOrder: [],
      };
      (await noteService.create(note))._unsafeUnwrap();

      expect((await documentStore.exists(note.id))._unsafeUnwrap()).toBe(true);

      await trash(note.id);
      await noteService.emptyTrash(workspace.id);

      expect((await documentStore.exists(note.id))._unsafeUnwrap()).toBe(false);
    });

    it("should handle empty trash gracefully", async () => {
      await expect(noteService.emptyTrash(workspace.id)).resolves.not.toThrow();
    });
  });
});
