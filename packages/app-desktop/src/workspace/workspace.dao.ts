import { isNotUndefined, NotFoundError } from "@darkwrite/common";
import { AppDataSource, DatabaseType, db, Transaction } from "../db";
import { Workspace as legacyWorkspace } from "../entity";
import { NewWorkspace, PatchWorkspace, Workspace, workspace as workspaceTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const repo = AppDataSource.getRepository(legacyWorkspace);

/** @deprecated */
export const _WorkspaceDAO = {
  save: async (workspace: legacyWorkspace) => repo.save(workspace),
  saveAll: async (workspaces: legacyWorkspace[]) => repo.save(workspaces),
  findById: async (id: string) => repo.findOne({ where: { id } }),

  findByIdOrThrow: async (id: string) => {
    const workspace = await repo.findOne({ where: { id } });
    if (!workspace) throw new NotFoundError("Workspace", id);
    return workspace;
  },

  findAll: async () => repo.find(),
  deleteById: async (id: string) => repo.delete({ id }),
  delete: async (workspace: legacyWorkspace) => repo.delete({ id: workspace.id }),
};

export class WorkspaceDAO {
  constructor(private tx: Transaction | DatabaseType = db){}

  async create(workspace: NewWorkspace): Promise<Workspace> {
    return (await this.tx.insert(workspaceTable).values(workspace).returning())[0];
  }

  async update(workspace: PatchWorkspace) {
    return (await this.tx.update(workspaceTable).set(workspace).where(eq(workspaceTable.id, workspace.id)).returning()).at(0);
  }

  /** Update multiple workspaces.
  * @returns the affected workspaces **in no particular order.** */
  async updateAll(workspaces: PatchWorkspace[]): Promise<Workspace[]> {
    return (await Promise.all(workspaces.map(w => this.update(w)))).filter(isNotUndefined);
  }

  async findById(id: string): Promise<Workspace | null> {
    return (await this.tx.select().from(workspaceTable).where(eq(workspaceTable.id, id)).limit(1)).at(0) ?? null;
  }

  async findByIdOrThrow(id: string): Promise<Workspace> {
    const result = await this.findById(id);
    if (!result) throw new NotFoundError("Workspace", id);
    return result;
  }

  async findAll(): Promise<Workspace[]> {
    return this.tx.select().from(workspaceTable);
  }

  async deleteById(id: string) {
    return this.tx.delete(workspaceTable).where(eq(workspaceTable.id, id));
  }

  async delete(value: Workspace) {
    this.deleteById(value.id);
  }

}
