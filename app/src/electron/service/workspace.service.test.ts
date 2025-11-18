import { getDefaultWorkspaceConfiguration } from "@/lib/workspace-config";
import { AppDataSource } from "../db";
import { Workspace } from "../entity";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceRepository } from "../repository/workspace.repository";

const workspaceService = new WorkspaceService();

class MockRepo extends WorkspaceRepository {
  override async findAll() {
    return [];
  }

  override async save() {
    return new Workspace();
  }
}

beforeAll(async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
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
  expect(result.map((w) => w.name).includes(w1.name));
  expect(result.map((w) => w.name).includes(w2.name));
});

it("should initialize default workspace", async () => {
  const mockedService = new WorkspaceService(new MockRepo());
  const result = await mockedService.initializeDefaultWorkspace();
  expect(result).toBeInstanceOf(Workspace);
});
