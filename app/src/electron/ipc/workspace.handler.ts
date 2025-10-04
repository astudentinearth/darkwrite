import { IWorkspaceAPI } from "@/common/contract";
import { ServiceContainer } from "../service-container";
import { UpdateWorkspaceDTO, UpdateWorkspaceDTOSchema } from "@/common/dto/request/workspace.request";

export const ElectronWorkspaceAPI: IWorkspaceAPI = {
  async create(dto) {
    const workspace =
      await ServiceContainer.workspaceService.createWorkspace(dto);
    return { workspace: workspace.mapToDTO() };
  },
  async delete() {
    //TODO: implement
  },
  async getAll() {
    const workspaces = (
      await ServiceContainer.workspaceService.getWorkspaces()
    ).map((w) => w.mapToDTO());
    return { workspaces };
  },
  async update(id: string, dto: UpdateWorkspaceDTO) {
    const sanitizedDto = UpdateWorkspaceDTOSchema.parse(dto);
    const workspace = await ServiceContainer.workspaceService.update(id, sanitizedDto);
    return { workspace: workspace.mapToDTO() };
  },
};
