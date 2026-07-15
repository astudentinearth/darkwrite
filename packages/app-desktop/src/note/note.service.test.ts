import { DatabaseViewType, NoteType, type ParentId } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  databaseView as databaseViewTable,
  type NewNote,
  type Note,
  note as notesTable,
  type Workspace,
} from "@/db/schema";
import { resolveTx } from "@/db/transactional";
import { DatabaseViewDAO } from "@/note/database-view.dao";
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
  let viewDao: ReturnType<typeof DatabaseViewDAO>;
  const documentStore = MockDocumentStore();

  beforeAll(async () => {
    await applySqlMigrations(db);
    noteDAO = NoteDAO(() => resolveTx(db));
    noteService = NoteService(db, DocumentService(documentStore));
    viewDao = DatabaseViewDAO(() => resolveTx(db));
    workspace = (
      await WorkspaceDAO(() => resolveTx(db)).create({
        name: "Test Workspace",
        createdAt: new Date(),
      })
    )._unsafeUnwrap();
  });
  beforeEach(async () => {
    await db.delete(databaseViewTable);
    await db.delete(notesTable);
    await documentStore
      .ls()
      .andThen((docs) =>
        ResultAsync.combine(docs.map((id) => documentStore.delete(id))),
      );
  });

  async function createNote(
    title: string,
    parentId: ParentId = null,
  ): Promise<Note> {
    const note: NewNote = {
      title,
      workspaceId: workspace.id,
      favoriteOrderHint: "",
      parentId,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    return (await noteDAO.create(note))._unsafeUnwrap();
  }

  describe("clear trash tests", () => {
    it("should clear all trashed notes in the workspace", async () => {
      const note1 = await createNote("Trashed 1");
      const note2 = await createNote("Trashed 2");

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

      const trashedInOther: NewNote = {
        title: "Trashed in other",
        workspaceId: otherWorkspace.id,
        favoriteOrderHint: "",
        parentId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isTrashed: true,
        trashedAt: new Date(),
      };
      const saved = (await noteDAO.create(trashedInOther))._unsafeUnwrap();

      const localNote = await createNote("Local trashed");
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
      const alive = await createNote("Alive");
      const trashed = await createNote("Trashed");
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

  describe("move tests", () => {
    it("should move a note to a new parent", async () => {
      const parent = await createNote("Parent");
      const source = await createNote("Source");

      await noteService.move({
        sourceId: source.id,
        parentId: parent.id,
      });

      const updated = (await noteDAO.findById(source.id))._unsafeUnwrap();
      expect(updated.parentId).toBe(parent.id);
    });

    it("should move a note to root", async () => {
      const source = await createNote("Source", "some-parent");

      await noteService.move({ sourceId: source.id, parentId: null });

      const updated = (await noteDAO.findById(source.id))._unsafeUnwrap();
      expect(updated.parentId).toBeNull();
    });

    it("should prevent circular moves", async () => {
      const source = await createNote("Source");
      const child = await createNote("Child", source.id);

      const result = await noteService.move({
        sourceId: source.id,
        parentId: child.id,
      });

      expect(result.isErr()).toBe(true);
    });

    it("should not move a note that does not exist", async () => {
      const parent = await createNote("asdf");

      const result = await noteService.move({
        sourceId: "i do not exist",
        parentId: parent.id,
      });

      expect(result.isErr()).toBe(true);
    });

    it("should not move to a note that does not exist", async () => {
      const source = await createNote("source");
      const result = await noteService.move({
        sourceId: source.id,
        parentId: "i do not exist",
      });
      expect(result.isErr()).toBe(true);
    });

    it("should not move a trashed note", async () => {
      const source = await createNote("Source");
      await noteService.moveToTrash(source.id);
      const parent = await createNote("Parent");

      const result = await noteService.move({
        sourceId: source.id,
        parentId: parent.id,
      });

      expect(result.isErr()).toBe(true);
    });

    it("should update workspaceId when moving across workspaces", async () => {
      const otherWorkspace = (
        await WorkspaceDAO(() => resolveTx(db)).create({
          name: "Other Workspace",
          createdAt: new Date(),
        })
      )._unsafeUnwrap();

      const parentInOther = await createNote("Parent in other");
      await noteDAO.update({
        id: parentInOther.id,
        workspaceId: otherWorkspace.id,
      });

      const source = await createNote("Source");

      await noteService.move({
        sourceId: source.id,
        parentId: parentInOther.id,
      });

      const updated = (await noteDAO.findById(source.id))._unsafeUnwrap();
      expect(updated.parentId).toBe(parentInOther.id);
      expect(updated.workspaceId).toBe(otherWorkspace.id);
    });
  });

  describe("createDatabase", () => {
    it("should create a database, set document content, and initialize a default view", async () => {
      const result = (
        await noteService.createDatabase({
          workspaceId: workspace.id,
          parentId: null,
        })
      )._unsafeUnwrap();

      expect(result.database).not.toBeUndefined();
      expect(result.view).not.toBeUndefined();
      expect(result.viewMeta).not.toBeUndefined();

      expect(result.database.type).toBe(NoteType.Database);
      expect(result.database.title).toBe("New database");
      expect(result.database.workspaceId).toBe(workspace.id);
      expect(result.database.parentId).toBeNull();

      expect(result.view.type).toBe(NoteType.DatabaseView);
      expect(result.view.parentId).toBe(result.database.id);
      expect(result.view.workspaceId).toBe(workspace.id);

      expect(result.viewMeta.type).toBe(DatabaseViewType.Table);
      expect(result.viewMeta.id).toBe(result.view.id);

      const docContent = (
        await documentStore.read(result.database.id)
      )._unsafeUnwrap();

      expect(docContent).toBe("{}");
    });

    it("should create a database under a parent when specified", async () => {
      const parent = (
        await noteDAO.create({
          workspaceId: workspace.id,
          title: "Parent",
          createdAt: new Date(),
          modifiedAt: new Date(),
          favoriteOrderHint: "",
        })
      )._unsafeUnwrap();

      const result = (
        await noteService.createDatabase({
          workspaceId: workspace.id,
          parentId: parent.id,
        })
      )._unsafeUnwrap();

      expect(result.database.parentId).toBe(parent.id);
    });

    it("should return an error when the workspace does not exist", async () => {
      const result = await noteService.createDatabase({
        workspaceId: "non-existent-id",
        parentId: null,
      });

      expect(result.isErr()).toBe(true);
    });

    it("should persist the database and view to the database", async () => {
      const result = (
        await noteService.createDatabase({
          workspaceId: workspace.id,
          parentId: null,
        })
      )._unsafeUnwrap();

      const foundDatabase = (
        await noteDAO.findById(result.database.id)
      )._unsafeUnwrap();

      const foundView = (
        await noteDAO.findById(result.view.id)
      )._unsafeUnwrap();

      const foundViewMeta = (
        await viewDao.getView(result.viewMeta.id)
      )._unsafeUnwrap();

      expect(foundDatabase.title).toBe("New database");
      expect(foundView.parentId).toBe(result.database.id);
      expect(foundViewMeta.type).toBe(DatabaseViewType.Table);
    });
  });
});
