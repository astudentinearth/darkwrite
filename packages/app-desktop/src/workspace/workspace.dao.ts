import { dbResult } from "@/db/db-result";
import {
  type NewWorkspace,
  type PatchWorkspace,
  type Workspace,
  workspace as workspaceTable,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";
import { dwErr, type DwResultAsync } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ok } from "neverthrow";

export function WorkspaceDAO(tx: TxResolver) {
  function create(workspace: NewWorkspace): DwResultAsync<Workspace> {
    return dbResult(() =>
      tx().insert(workspaceTable).values(workspace).returning().get(),
    );
  }

  function update(workspace: PatchWorkspace): DwResultAsync<Workspace> {
    return dbResult(() =>
      tx()
        .update(workspaceTable)
        .set(workspace)
        .where(eq(workspaceTable.id, workspace.id))
        .returning(),
    ).andThen((rows) =>
      rows.at(0) ? ok(rows[0]) : dwErr("Workspace not found."),
    );
  }

  function findById(id: string): DwResultAsync<Workspace> {
    return dbResult(() =>
      tx().select().from(workspaceTable).where(eq(workspaceTable.id, id)).get(),
    ).andThen((row) => (row ? ok(row) : dwErr("Workspace not found.")));
  }

  function findAll(): DwResultAsync<Workspace[]> {
    return dbResult(() => tx().select().from(workspaceTable));
  }

  function deleteById(id: string): DwResultAsync<void> {
    return dbResult(() =>
      tx().delete(workspaceTable).where(eq(workspaceTable.id, id)),
    ).andThen(() => ok());
  }

  function deleteWorkspace(value: Workspace): DwResultAsync<void> {
    return deleteById(value.id);
  }

  return {
    create,
    update,
    delete: deleteWorkspace,
    deleteById,
    findAll,
    findById,
  };
}

export type WorkspaceDAOInstance = ReturnType<typeof WorkspaceDAO>;
