import { dbResult } from "@/db/db-result";
import {
  Database,
  database as databaseTable,
  NewDatabase,
  PatchDatabase,
} from "@/db/schema";
import { DbError, TxResolver } from "@/db/transactional";
import {
  DatabaseError,
  errOnUndefined,
  firstOrErr,
  okVoid,
} from "@darkwrite/common";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

type DatabaseDaoResult<T> = ResultAsync<T, DatabaseError | DbError>;

export function DatabaseDAO(tx: TxResolver) {
  function create(database: NewDatabase): DatabaseDaoResult<Database> {
    return dbResult(() =>
      tx().insert(databaseTable).values(database).returning().get(),
    );
  }

  function update(database: PatchDatabase): DatabaseDaoResult<Database> {
    return dbResult(() =>
      tx()
        .update(databaseTable)
        .set(database)
        .where(eq(databaseTable.id, database.id))
        .returning(),
    ).andThen(
      firstOrErr<DatabaseError>({
        type: "database-not-found",
        id: database.id,
      }),
    );
  }

  function findById(id: string): DatabaseDaoResult<Database> {
    return dbResult(() =>
      tx().select().from(databaseTable).where(eq(databaseTable.id, id)).get(),
    ).andThen(
      errOnUndefined<DatabaseError>({ type: "database-not-found", id }),
    );
  }

  function findAll(): DatabaseDaoResult<Database[]> {
    return dbResult(() => tx().select().from(databaseTable));
  }

  function deleteById(id: string): DatabaseDaoResult<void> {
    return dbResult(() =>
      tx().delete(databaseTable).where(eq(databaseTable.id, id)),
    ).andThen(okVoid);
  }

  return {
    create,
    update,
    findById,
    findAll,
    deleteById,
  };
}
