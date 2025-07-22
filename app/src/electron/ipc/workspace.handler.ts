import { IWorkspaceAPI } from "@/common/contract";
import { ServiceContainer } from "../service-container";

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
  async update(id: string) {
    //TODO: implement
    const workspace =
      await ServiceContainer.workspaceService.findWorkspaceOrThrow(id);
    return { workspace: workspace.mapToDTO() };
  },
};
