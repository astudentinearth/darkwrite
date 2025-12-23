import { IWorkspaceAPI } from "@/common/contract";
import {
  UpdateWorkspaceDTO,
  UpdateWorkspaceDTOSchema,
} from "@/common/dto/request/workspace.request";
import { WorkspaceService } from "./workspace.service";
import { IPCHandler } from "../types/ipc-handler";

const service = new WorkspaceService();

export const ElectronWorkspaceAPI: IWorkspaceAPI = {
  async create(dto) {
    const workspace = await service.createWorkspace(dto);
    return { workspace: workspace.mapToDTO() };
  },
  async delete() {
    //TODO: implement
  },
  async getAll() {
    const workspaces = (await service.getWorkspaces()).map((w) => w.mapToDTO());
    return { workspaces };
  },
  async update(id: string, dto: UpdateWorkspaceDTO) {
    const sanitizedDto = UpdateWorkspaceDTOSchema.parse(dto);
    const workspace = await service.update(id, sanitizedDto);
    return { workspace: workspace.mapToDTO() };
  },
};

export const WorkspacesApiBridge = {
  create: new IPCHandler(false, ElectronWorkspaceAPI.create),
  update: new IPCHandler(false, ElectronWorkspaceAPI.update),
  getAll: new IPCHandler(false, ElectronWorkspaceAPI.getAll),
  delete: new IPCHandler(false, ElectronWorkspaceAPI.delete),
};
