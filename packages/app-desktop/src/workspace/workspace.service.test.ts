import { getDefaultWorkspaceConfiguration } from "@darkwrite/common";
import { createTestDatabase, DatabaseType, applySqlMigrations } from "../db";
import { WorkspaceService } from "./workspace.service";
import { workspace } from "@/db/schema";

let _db: DatabaseType = createTestDatabase();
const workspaceService = new WorkspaceService(_db);

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
