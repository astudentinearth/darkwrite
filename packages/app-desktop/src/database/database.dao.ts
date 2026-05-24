import { dbResult } from "@/db/db-result";
import {
  Database,
  database as databaseTable,
  NewDatabase,
  PatchDatabase,
} from "@/db/schema";
import { TxResolver } from "@/db/transactional";
import {
    buildDwError,
    DwResultAsync,
  errOnUndefined,
  firstOrErr,
  okVoid,
} from "@darkwrite/common";
import { eq } from "drizzle-orm";


export function DatabaseDAO(tx: TxResolver) {
  function create(database: NewDatabase): DwResultAsync<Database> {
    return dbResult(() =>
      tx().insert(databaseTable).values(database).returning().get(),
    );
  }

  function update(database: PatchDatabase): DwResultAsync<Database> {
    return dbResult(() =>
      tx()
        .update(databaseTable)
        .set(database)
        .where(eq(databaseTable.id, database.id))
        .returning(),
    ).andThen(
      firstOrErr(buildDwError("Database not found.")),
    );
  }

  function findById(id: string): DwResultAsync<Database> {
    return dbResult(() =>
      tx().select().from(databaseTable).where(eq(databaseTable.id, id)).get(),
    ).andThen(
      errOnUndefined(buildDwError("Database not found.")),
    );
  }

  function findAll(): DwResultAsync<Database[]> {
    return dbResult(() => tx().select().from(databaseTable));
  }

  function deleteById(id: string): DwResultAsync<void> {
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
