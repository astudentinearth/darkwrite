import { eq } from "drizzle-orm";
import { dbResult } from "@/db/db-result";
import {
  type NewPropertyDefRow,
  type PropertyDefRow,
  propertyDefinition,
} from "@/db/schema";
import type { TxResolver } from "@/db/transactional";

export function NotePropertyDAO(tx: TxResolver) {
  const getDatabaseSchema = (id: string) =>
    dbResult(() =>
      tx()
        .select()
        .from(propertyDefinition)
        .where(eq(propertyDefinition.databaseId, id)),
    ).map((properties) => Object.fromEntries(properties.map((p) => [p.id, p])));

  const addDatabaseColumn = (column: NewPropertyDefRow) =>
    dbResult(() =>
      tx().insert(propertyDefinition).values([column]).returning(),
    );

  const updateDatabaseColumn = (id: string, patch: Partial<PropertyDefRow>) =>
    dbResult(() =>
      tx()
        .update(propertyDefinition)
        .set(patch)
        .where(eq(propertyDefinition.id, id)),
    );

  const dropDatabaseColumn = (columnId: string) =>
    dbResult(() =>
      tx()
        .delete(propertyDefinition)
        .where(eq(propertyDefinition.id, columnId)),
    );

  return {
    getDatabaseSchema,
    addDatabaseColumn,
    updateDatabaseColumn,
    dropDatabaseColumn,
  };
}
