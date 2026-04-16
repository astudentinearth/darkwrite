import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "@darkwrite/common";
import { getDefaultWorkspaceConfiguration } from "@darkwrite/common";
import { WorkspaceDAO } from "./workspace.dao";
import { Workspace } from "@/db/schema";
import { DatabaseType, db as defaultDb } from "@/db";

export class WorkspaceService {
  private workspaceDAO: WorkspaceDAO;
  constructor(
    private db: DatabaseType = defaultDb,
    workspaceDAO?: WorkspaceDAO,
  ) {
    this.workspaceDAO = workspaceDAO ?? new WorkspaceDAO(this.db);
  }

  async createWorkspace(dto: CreateWorkspaceDTO): Promise<Workspace> {
    const { config, name, iconUrl } = dto;
    return await this.workspaceDAO.create({
      createdAt: new Date(),
      name,
      iconUrl,
      config,
    });
  }

  /** Initializes a default workspace if no workspaces exist. Returns true if a workspace already exists, or the newly created workspace if not.
   * This method is idempotent, and calling it again is harmless. */
  async initializeDefaultWorkspace() {
    const workspaces = await this.workspaceDAO.findAll();
    if (workspaces.length > 0) return true;
    else
      return this.createWorkspace({
        name: "My Workspace",
        config: getDefaultWorkspaceConfiguration(),
      });
  }

  async findWorkspaceOrThrow(id: string): Promise<Workspace> {
    return await this.workspaceDAO.findByIdOrThrow(id);
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return await this.workspaceDAO.findAll();
  }

  async update(id: string, dto: UpdateWorkspaceDTO) {
    return await this.workspaceDAO.update({ id, ...dto });
  }
}
