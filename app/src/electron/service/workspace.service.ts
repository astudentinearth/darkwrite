import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
} from "@/common/dto/request/workspace.request";
import { Workspace } from "../entity";
import { WorkspaceRepository } from "../repository/workspace.repository";
import { getDefaultWorkspaceConfiguration } from "@/lib/workspace-config";

export class WorkspaceService {
  constructor(
    private workspaceRepository: WorkspaceRepository = new WorkspaceRepository(),
  ) {}

  async createWorkspace(dto: CreateWorkspaceDTO): Promise<Workspace> {
    const { config, name, icon_url } = dto;
    const workspace = new Workspace();
    workspace.config = config;
    workspace.name = name;
    workspace.icon_url = icon_url;
    workspace.created_at = new Date();
    return this.workspaceRepository.save(workspace);
  }

  async initializeDefaultWorkspace() {
    const workspaces = await this.workspaceRepository.findAll();
    if (workspaces.length > 0) return true;
    else
      return this.createWorkspace({
        name: "My Workspace",
        config: getDefaultWorkspaceConfiguration(),
      });
  }

  async findWorkspaceOrThrow(id: string): Promise<Workspace> {
    const result = await this.workspaceRepository.findById(id);
    if (result == null) {
      throw new Error(`Workspace ${id} does not exist.`);
    }
    return result;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return await this.workspaceRepository.findAll();
  }

  async update(id: string, dto: UpdateWorkspaceDTO) {
    const workspace = await this.findWorkspaceOrThrow(id);
    Object.assign(workspace, dto);
    return await this.workspaceRepository.save(workspace);
  }
}
