import {
  CreateWorkspaceDTO,
  IWorkspaceAPI,
  NotFoundError,
} from "@darkwrite/common";
import {
  UpdateWorkspaceDTO,
  UpdateWorkspaceDTOSchema,
} from "@darkwrite/common";
import { IWorkspaceService, WorkspaceService } from "./workspace.service";
import { handler, HandlerImplements, IPCHandler } from "../types/ipc-handler";
import { workspaceToDto } from "./workspace-mapper";
import { mapDbError } from "@/error";

const service = new WorkspaceService();


export const ElectronWorkspaceAPI: IWorkspaceAPI = {
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

export function WorkspaceAPI(workspaceService: IWorkspaceService): HandlerImplements<IWorkspaceAPI> {

  const create = handler((dto: CreateWorkspaceDTO) =>
    workspaceService
      .createWorkspace(dto)
      .mapErr(mapDbError)
      .map(workspaceToDto)
      .map((workspace) => ({ workspace })),
  );

    const deleteWorkspace = handler((id: string) => )

  return { create }
}

export const WorkspacesApiBridge = {
  create: new IPCHandler(false, ElectronWorkspaceAPI.create),
  update: new IPCHandler(false, ElectronWorkspaceAPI.update),
  getAll: new IPCHandler(false, ElectronWorkspaceAPI.getAll),
  delete: new IPCHandler(false, ElectronWorkspaceAPI.delete),
};
