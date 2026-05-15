import { dbResult } from "@/db/db-result";
import {
  NewWorkspace,
  PatchWorkspace,
  Workspace,
  workspace as workspaceTable,
} from "@/db/schema";
import { DbError, TxResolver } from "@/db/transactional";
import { NotFoundError, WorkspaceError } from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

export type WorkspaceDaoResult<T> = ResultAsync<T, DbError | WorkspaceError>;

export function WorkspaceDAO(tx: TxResolver) {
  function create(workspace: NewWorkspace): WorkspaceDaoResult<Workspace> {
    return dbResult(() =>
      tx().insert(workspaceTable).values(workspace).returning().get(),
    );
  }

  function update(workspace: PatchWorkspace): WorkspaceDaoResult<Workspace> {
    return dbResult(() =>
      tx()
        .update(workspaceTable)
        .set(workspace)
        .where(eq(workspaceTable.id, workspace.id))
        .returning(),
    ).andThen((rows) =>
      rows.at(0)
        ? ok(rows[0])
        : err<Workspace, WorkspaceError>({
            type: "workspace-not-found",
            id: workspace.id,
          }),
    );
  }

  function findById(id: string): WorkspaceDaoResult<Workspace> {
    return dbResult(() =>
      tx().select().from(workspaceTable).where(eq(workspaceTable.id, id)).get(),
    ).andThen((row) =>
      row
        ? ok(row)
        : err({ type: "workspace-not-found", id } satisfies WorkspaceError),
    );
  }

  /** Finds a workspace by id, or throws if it doesn't exist.
   * @throws `NotFoundError` if the workspace does not exist.
   * @deprecated
   * */
  async function findByIdOrThrow(id: string): Promise<Workspace> {
    const result = await findById(id);
    if (result.isErr()) throw new NotFoundError("Workspace", id);
    return result._unsafeUnwrap();
  }

  function findAll(): WorkspaceDaoResult<Workspace[]> {
    return dbResult(() => tx().select().from(workspaceTable));
  }

  function deleteById(id: string): WorkspaceDaoResult<void> {
    return dbResult(() =>
      tx().delete(workspaceTable).where(eq(workspaceTable.id, id)),
    ).andThen(() => ok());
  }

  function deleteWorkspace(value: Workspace): WorkspaceDaoResult<void> {
    return deleteById(value.id);
  }

  return {
    create,
    update,
    delete: deleteWorkspace,
    deleteById,
    findAll,
    findByIdOrThrow,
    findById,
  };
}

export type WorkspaceDAOInstance = ReturnType<typeof WorkspaceDAO>;
