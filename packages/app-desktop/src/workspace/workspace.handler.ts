import {
  type CreateWorkspaceDTO,
  CreateWorkspaceDTOSchema,
  type IWorkspaceAPI,
  okVoid,
  type UpdateWorkspaceDTO,
  UpdateWorkspaceDTOSchema,
  validateSchema,
} from "@darkwrite/common";
import { handler, type HandlerImplements } from "../types/ipc-handler";
import { workspaceToDto } from "./workspace-mapper";
import type { IWorkspaceService } from "./workspace.service";

export function WorkspaceAPI(
  workspaceService: IWorkspaceService,
): HandlerImplements<IWorkspaceAPI> {

  const create = handler((dto: CreateWorkspaceDTO) =>
    validateSchema(CreateWorkspaceDTOSchema)(dto)
      .asyncAndThen((dto) => workspaceService.createWorkspace(dto))
      .map(workspaceToDto)
      .map((workspace) => ({ workspace })),
  );

  const deleteWorkspace = handler((id: string) =>
    workspaceService.deleteWorkspace(id).andThen(okVoid),
  );

  const getAll = handler(() =>
    workspaceService
      .getWorkspaces()
      .map((w) => ({ workspaces: w.map(workspaceToDto) })),
  );

  const update = handler((id: string, dto: UpdateWorkspaceDTO) =>
    validateSchema(UpdateWorkspaceDTOSchema)(dto)
      .asyncAndThen((dto) => workspaceService.update(id, dto))
      .map(workspaceToDto)
      .map((workspace) => ({ workspace })),
  );

  return { create, delete: deleteWorkspace, getAll, update };
}
