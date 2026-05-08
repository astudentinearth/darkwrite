import {
  getDefaultWorkspaceConfiguration,
  NotFoundError,
} from "@darkwrite/common";
import { createTestDatabase, DatabaseType, applySqlMigrations } from "../db";
import { WorkspaceService } from "./workspace.service";
import { NewNote, workspace } from "@/db/schema";
import { WorkspaceDAO } from "./workspace.dao";
import { NoteDAO } from "@/note/note.dao";
import { DocumentService } from "@/service/document.service";
import { MockDocumentStore } from "@/test/mocks/document-store.mock";
import { IDocumentStore } from "@/lib/document-store";

let _db: DatabaseType = createTestDatabase();
const workspaceDao = new WorkspaceDAO(_db);
const noteDao = new NoteDAO(_db);
const documentService = new DocumentService(new MockDocumentStore());
const workspaceService = new WorkspaceService(
  _db,
  workspaceDao,
  noteDao,
  documentService,
);

beforeAll(async () => {
  await applySqlMigrations(_db);
});

beforeEach(async () => {
  await _db.delete(workspace);
});

it("should create a workspace", async () => {
  const result = await workspaceService.createWorkspace({
    name: "test workspace",
    config: getDefaultWorkspaceConfiguration(),
  });
  expect(result.name).toBe("test workspace");
});

it("should get workspaces", async () => {
  const w1 = await workspaceService.createWorkspace({
    name: "test workspace 1",
    config: getDefaultWorkspaceConfiguration(),
  });
  const w2 = await workspaceService.createWorkspace({
    name: "test workspace 2",
    config: getDefaultWorkspaceConfiguration(),
  });
  const result = await workspaceService.getWorkspaces();
  expect(result.map((w) => w.name).includes(w1.name)).toBe(true);
  expect(result.map((w) => w.name).includes(w2.name)).toBe(true);
});

it("should initialize default workspace", async () => {
  const mockedService = new WorkspaceService(_db);
  const result = await mockedService.initializeDefaultWorkspace();
  expect(result).toBeTruthy();
});

describe("delete workspace", () => {
  async function createWorkspace(name = "test workspace") {
    return workspaceService.createWorkspace({
      name,
      config: getDefaultWorkspaceConfiguration(),
    });
  }

  async function createNote(workspaceId: string, title = "test note") {
    const note: NewNote = {
      title,
      workspaceId,
      orderHint: "a",
      favoriteOrderHint: "a",
      parentId: null,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    return noteDao.create(note);
  }

  it("should delete a workspace and its notes", async () => {
    const ws = await createWorkspace();
    await createNote(ws.id, "note 1");
    await createNote(ws.id, "note 2");

    await workspaceService.delete(ws.id);

    const remainingWorkspaces = await workspaceDao.findAll();
    const remainingNotes = await noteDao.findAllByWorkspaceId(ws.id);
    expect(remainingWorkspaces.some((w) => w.id === ws.id)).toBe(false);
    expect(remainingNotes).toHaveLength(0);
  });

  it("should throw if the workspace does not exist", async () => {
    await expect(workspaceService.delete("non-existent-id")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should not delete notes from other workspaces", async () => {
    const ws1 = await createWorkspace("workspace 1");
    const ws2 = await createWorkspace("workspace 2");
    await createNote(ws1.id, "note in ws1");
    const noteInWs2 = await createNote(ws2.id, "note in ws2");

    await workspaceService.delete(ws1.id);

    const remainingNotes = await noteDao.findAllByWorkspaceId(ws2.id);
    expect(remainingNotes.some((n) => n.id === noteInWs2.id)).toBe(true);
  });

  it("should remove note contents from the filesystem", async () => {
    const mockStore = new MockDocumentStore();
    const svc = new WorkspaceService(
      _db,
      workspaceDao,
      noteDao,
      new DocumentService(mockStore),
    );
    const ws = await createWorkspace();
    const n1 = await createNote(ws.id, "note 1");
    const n2 = await createNote(ws.id, "note 2");
    await mockStore.create(n1.id);
    await mockStore.create(n2.id);

    await svc.delete(ws.id);

    expect(await mockStore.exists(n1.id)).toBe(false);
    expect(await mockStore.exists(n2.id)).toBe(false);
  });

  it("should not throw if file deletion step fails", async () => {
    class FailingDocumentStore extends MockDocumentStore {
      async delete() {
        throw new Error("disk error");
      }
    }

    const failingStore: IDocumentStore = new FailingDocumentStore();
    const svc = new WorkspaceService(
      _db,
      workspaceDao,
      noteDao,
      new DocumentService(failingStore),
    );
    const ws = await createWorkspace();
    await createNote(ws.id);

    await expect(svc.delete(ws.id)).resolves.toBeUndefined();
  });

  it("should delete a workspace with no notes", async () => {
    const ws = await createWorkspace("empty workspace");

    await workspaceService.delete(ws.id);

    const remainingWorkspaces = await workspaceDao.findAll();
    expect(remainingWorkspaces.some((w) => w.id === ws.id)).toBe(false);
  });

  it("should throw on a second delete of the same workspace", async () => {
    const ws = await createWorkspace();
    await workspaceService.delete(ws.id);

    await expect(workspaceService.delete(ws.id)).rejects.toThrow(NotFoundError);
  });
});
