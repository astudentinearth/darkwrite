import { dwErrAsync, getDefaultWorkspaceConfiguration } from "@darkwrite/common";
import { createTestDatabase, DatabaseType, applySqlMigrations } from "../db";
import { WorkspaceService } from "./workspace.service";
import { NewNote, workspace } from "@/db/schema";
import { WorkspaceDAO } from "./workspace.dao";
import { NoteDAO } from "@/note/note.dao";
import { DocumentService } from "@/service/document.service";
import { MockDocumentStore } from "@/test/mocks/document-store.mock";
import { IDocumentStore } from "@/lib/document-store";
import { resolveTx } from "@/db/transactional";

let _db: DatabaseType = createTestDatabase();
const workspaceDao = WorkspaceDAO(() => resolveTx(_db));
const noteDao = NoteDAO(() => resolveTx(_db));
const documentService = DocumentService(MockDocumentStore());
const workspaceService = WorkspaceService(_db, documentService);

beforeAll(async () => {
  await applySqlMigrations(_db);
});

beforeEach(async () => {
  await _db.delete(workspace);
});

it("should create a workspace", async () => {
  const result = (
    await workspaceService.createWorkspace({
      name: "test workspace",
      config: getDefaultWorkspaceConfiguration(),
    })
  )._unsafeUnwrap();
  expect(result.name).toBe("test workspace");
});

it("should get workspaces", async () => {
  const w1 = (
    await workspaceService.createWorkspace({
      name: "test workspace 1",
      config: getDefaultWorkspaceConfiguration(),
    })
  )._unsafeUnwrap();
  const w2 = (
    await workspaceService.createWorkspace({
      name: "test workspace 2",
      config: getDefaultWorkspaceConfiguration(),
    })
  )._unsafeUnwrap();
  const result = (await workspaceService.getWorkspaces())._unsafeUnwrap();
  expect(result.map((w) => w.name).includes(w1.name)).toBe(true);
  expect(result.map((w) => w.name).includes(w2.name)).toBe(true);
});

it("should initialize default workspace", async () => {
  const mockedService = WorkspaceService(
    _db,
    DocumentService(MockDocumentStore()),
  );
  const result = await mockedService.initializeDefaultWorkspace();
  expect(result._unsafeUnwrap()).toMatchObject({ name: "My Workspace" });
});

describe("delete workspace", () => {
  async function createWorkspace(name = "test workspace") {
    return (
      await workspaceService.createWorkspace({
        name,
        config: getDefaultWorkspaceConfiguration(),
      })
    )._unsafeUnwrap();
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
    return (await noteDao.create(note))._unsafeUnwrap();
  }

  it("should delete a workspace and its notes", async () => {
    const ws = await createWorkspace();
    await createNote(ws.id, "note 1");
    await createNote(ws.id, "note 2");

    await workspaceService.deleteWorkspace(ws.id);

    const remainingWorkspaces = (await workspaceDao.findAll())._unsafeUnwrap();
    const remainingNotes = (
      await noteDao.findAllByWorkspaceId(ws.id)
    )._unsafeUnwrap();
    expect(remainingWorkspaces.some((w) => w.id === ws.id)).toBe(false);
    expect(remainingNotes).toHaveLength(0);
  });

  it("should err if the workspace does not exist", async () => {
    expect(
      (
        await workspaceService.deleteWorkspace("non-existent-id")
      )._unsafeUnwrapErr(),
    ).not.toBeUndefined();
  });

  it("should not delete notes from other workspaces", async () => {
    const ws1 = await createWorkspace("workspace 1");
    const ws2 = await createWorkspace("workspace 2");
    await createNote(ws1.id, "note in ws1");
    const noteInWs2 = await createNote(ws2.id, "note in ws2");

    await workspaceService.deleteWorkspace(ws1.id);

    const remainingNotes = (
      await noteDao.findAllByWorkspaceId(ws2.id)
    )._unsafeUnwrap();
    expect(remainingNotes.some((n) => n.id === noteInWs2.id)).toBe(true);
  });

  it("should remove note contents from the filesystem", async () => {
    const mockStore = MockDocumentStore();
    const svc = WorkspaceService(_db, DocumentService(mockStore));
    const ws = await createWorkspace();
    const n1 = await createNote(ws.id, "note 1");
    const n2 = await createNote(ws.id, "note 2");
    await mockStore.create(n1.id);
    await mockStore.create(n2.id);

    await svc.deleteWorkspace(ws.id);

    expect((await mockStore.exists(n1.id))._unsafeUnwrap()).toBe(false);
    expect((await mockStore.exists(n2.id))._unsafeUnwrap()).toBe(false);
  });

  it("should not err if file deletion step fails", async () => {
    const failingStore: IDocumentStore = {
      ...MockDocumentStore(),
      delete: () => dwErrAsync("bla bla"),
    };
    const svc = WorkspaceService(_db, DocumentService(failingStore));
    const ws = await createWorkspace();
    await createNote(ws.id);

    expect((await svc.deleteWorkspace(ws.id)).isErr()).toBe(false);
  });

  it("should delete a workspace with no notes", async () => {
    const ws = await createWorkspace("empty workspace");

    await workspaceService.deleteWorkspace(ws.id);

    const remainingWorkspaces = (await workspaceDao.findAll())._unsafeUnwrap();
    expect(remainingWorkspaces.some((w) => w.id === ws.id)).toBe(false);
  });

  it("should error on a second delete of the same workspace", async () => {
    const ws = await createWorkspace();
    await workspaceService.deleteWorkspace(ws.id);

    expect(
      (await workspaceService.deleteWorkspace(ws.id))._unsafeUnwrapErr(),
    ).not.toBeUndefined();
  });
});
