import { MockDocumentStore } from "@/test/mocks/document-store.mock";
import { AppDataSource } from "../db";
import { rmIfExists } from "../lib/fs";
import { DatabaseRepository } from "../repository/database.repository";
import { NoteRepository } from "../repository/note.repository";
import { WorkspaceRepository } from "../repository/workspace.repository";
import { DatabaseService } from "./database.service";
import { DocumentService } from "./document.service";
import { NoteService } from "./note.service";
import { WorkspaceService } from "./workspace.service";
import { getDefaultWorkspaceConfiguration } from "@/lib/workspace-config";

let workspaceId: string = "";

const mockDocumentStore = new MockDocumentStore();

const noteService = new NoteService(
  new NoteRepository(),
  new DatabaseRepository(),
  new WorkspaceRepository(),
  new WorkspaceService(),
  new DatabaseService(),
  new DocumentService(mockDocumentStore)
);

beforeAll(async () => {
  if(!AppDataSource.isInitialized) await AppDataSource.initialize();
  const workspace = await new WorkspaceService().createWorkspace({name: "test workspace", config: getDefaultWorkspaceConfiguration()});
  workspaceId = workspace.id;
});

it("should create notes", async () => {
  const result = await noteService.create({
    title: "new note",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId,
  });
  expect(result.title).toBe("new note");
  expect(mockDocumentStore.exists(result.id));
});

it("should find a note by id", async () => {
  const note = await noteService.create({
    title: "new note",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId,
  });
  const result = await noteService.getById(note.id);
  expect(result).not.toBeNull();
  expect(result?.id).toBe(note.id);
});

it("should update notes", async () => {
  const note = await noteService.create({
    title: "new note",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId,
  });
  note.isFavorite = true;
  const result = await noteService.update(note.id, note);
  expect(result.isFavorite).toBe(true);
  expect(result.id).toBe(note.id);
  expect(result.workspace.id).toBe(workspaceId);
  expect(result.database?.id).toBeUndefined();
});

