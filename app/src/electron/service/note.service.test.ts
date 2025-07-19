import { AppDataSource } from "../db";
import { rmIfExists } from "../lib/fs";
import { NoteService } from "./note.service";
import { WorkspaceService } from "./workspace.service";

let workspaceId: string = "";

beforeAll(async () => {
  await rmIfExists("_test.db");
  await AppDataSource.initialize();
  const workspace = await new WorkspaceService().initializeDefaultWorkspace();
  if (typeof workspace === "boolean") throw new Error("sad");
  workspaceId = workspace.id;
});

it("should create notes", async () => {
  const noteService = new NoteService();
  const result = await noteService.create({
    title: "new note",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId,
  });
  expect(result.title).toBe("new note");
});

it("should find a note by id", async () => {
  const noteService = new NoteService();
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
  const noteService = new NoteService();
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
});

afterAll(async () => {
  rmIfExists("_test.db");
});
