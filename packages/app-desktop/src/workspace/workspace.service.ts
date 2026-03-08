import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
} from "@darkwrite/common/dto/request/workspace.request";
import { Workspace } from "../entity";
import { getDefaultWorkspaceConfiguration } from "@/lib/workspace-config";
import { WorkspaceDAO } from "./workspace.dao";
import { NotFoundError } from "@darkwrite/common/error";

export class WorkspaceService {
  constructor(private workspaceDAO = WorkspaceDAO) {}

  async createWorkspace(dto: CreateWorkspaceDTO): Promise<Workspace> {
    const { config, name, icon_url } = dto;
    const workspace = new Workspace();
    workspace.config = config;
    workspace.name = name;
    workspace.icon_url = icon_url;
    workspace.created_at = new Date();
    return this.workspaceDAO.save(workspace);
  }

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
    const result = await this.workspaceDAO.findById(id);
    if (result == null) {
      throw new NotFoundError("Workspace", id);
    }
    return result;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return await this.workspaceDAO.findAll();
  }

  async update(id: string, dto: UpdateWorkspaceDTO) {
    const workspace = await this.findWorkspaceOrThrow(id);
    Object.assign(workspace, dto);
    return await this.workspaceDAO.save(workspace);
  }
}
