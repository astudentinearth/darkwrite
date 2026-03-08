import { NotFoundError } from "@darkwrite/common/error";
import { AppDataSource } from "../db";
import { Workspace } from "../entity";

const repo = AppDataSource.getRepository(Workspace);

export const WorkspaceDAO = {
  save: async (workspace: Workspace) => repo.save(workspace),
  saveAll: async (workspaces: Workspace[]) => repo.save(workspaces),
  findById: async (id: string) => repo.findOne({ where: { id } }),

  findByIdOrThrow: async (id: string) => {
    const workspace = await repo.findOne({ where: { id } });
    if (!workspace) throw new NotFoundError("Workspace", id);
    return workspace;
  },

  findAll: async () => repo.find(),
  deleteById: async (id: string) => repo.delete({ id }),
  delete: async (workspace: Workspace) => repo.delete({ id: workspace.id }),
};
