import { IWorkspaceAPI, NotFoundError } from "@darkwrite/common";
import {
  UpdateWorkspaceDTO,
  UpdateWorkspaceDTOSchema,
} from "@darkwrite/common";
import { WorkspaceService } from "./workspace.service";
import { IPCHandler } from "../types/ipc-handler";
import { workspaceToDto } from "./workspace-mapper";

let service: WorkspaceService;

export function initializeWorkspaceAPI() {
  service = new WorkspaceService();
}

export const ElectronWorkspaceAPI: IWorkspaceAPI = {
  async create(dto) {
    const workspace = await service.createWorkspace(dto);
    return { workspace: workspaceToDto(workspace) };
  },
  async delete(workspaceId: string) {
    await service.delete(workspaceId);
  },
  async getAll() {
    const workspaces = (await service.getWorkspaces()).map((w) =>
      workspaceToDto(w),
    );
    return { workspaces };
  },
  async update(id: string, dto: UpdateWorkspaceDTO) {
    const sanitizedDto = UpdateWorkspaceDTOSchema.parse(dto);
    const workspace = await service.update(id, sanitizedDto);
    if (!workspace) throw new NotFoundError("Workspace", id);
    return { workspace: workspaceToDto(workspace) };
  },
};

export const WorkspacesApiBridge = {
  create: new IPCHandler(false, ElectronWorkspaceAPI.create),
  update: new IPCHandler(false, ElectronWorkspaceAPI.update),
  getAll: new IPCHandler(false, ElectronWorkspaceAPI.getAll),
  delete: new IPCHandler(false, ElectronWorkspaceAPI.delete),
};
