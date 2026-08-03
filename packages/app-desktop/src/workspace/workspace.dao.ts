import { type DwResultAsync, dwErr } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ok } from "neverthrow";
import { dbResult } from "@/db/db-result";
import {
  type NewWorkspaceRow,
  type PatchWorkspaceRow,
  type WorkspaceRow,
  workspace as workspaceTable,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";

export function WorkspaceDAO(tx: TxResolver) {
  function create(workspace: NewWorkspaceRow): DwResultAsync<WorkspaceRow> {
    return dbResult(() =>
      tx().insert(workspaceTable).values(workspace).returning().get(),
    );
  }

  function update(workspace: PatchWorkspaceRow): DwResultAsync<WorkspaceRow> {
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

  function findById(id: string): DwResultAsync<WorkspaceRow> {
    return dbResult(() =>
      tx().select().from(workspaceTable).where(eq(workspaceTable.id, id)).get(),
    ).andThen((row) => (row ? ok(row) : dwErr("Workspace not found.")));
  }

  function findAll(): DwResultAsync<WorkspaceRow[]> {
    return dbResult(() => tx().select().from(workspaceTable));
  }

  function deleteById(id: string): DwResultAsync<void> {
    return dbResult(() =>
      tx().delete(workspaceTable).where(eq(workspaceTable.id, id)),
    ).andThen(() => ok());
  }

  function deleteWorkspace(value: WorkspaceRow): DwResultAsync<void> {
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
