import { isNotUndefined, NotFoundError } from "@darkwrite/common";
import { DatabaseType, db, Transaction } from "../db";
import {
  NewWorkspace,
  PatchWorkspace,
  Workspace,
  workspace as workspaceTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export class WorkspaceDAO {
  constructor(private tx: Transaction | DatabaseType = db) {}

  async create(workspace: NewWorkspace): Promise<Workspace> {
    return (
      await this.tx.insert(workspaceTable).values(workspace).returning()
    )[0];
  }

  async update(workspace: PatchWorkspace) {
    return (
      await this.tx
        .update(workspaceTable)
        .set(workspace)
        .where(eq(workspaceTable.id, workspace.id))
        .returning()
    ).at(0);
  }

  /** Update multiple workspaces.
   * @returns the affected workspaces **in no particular order.** */
  async updateAll(workspaces: PatchWorkspace[]): Promise<Workspace[]> {
    return (await Promise.all(workspaces.map((w) => this.update(w)))).filter(
      isNotUndefined,
    );
  }

  async findById(id: string): Promise<Workspace | null> {
    return (
      (
        await this.tx
          .select()
          .from(workspaceTable)
          .where(eq(workspaceTable.id, id))
          .limit(1)
      ).at(0) ?? null
    );
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
