import { eq } from "drizzle-orm";
import { dbResult } from "@/db/db-result";
import { databaseView, type NewDatabaseViewRow } from "@/db/schema";
import type { TxResolver } from "@/db/transactional";

export function DatabaseViewDAO(tx: TxResolver) {
  const getView = (id: string) =>
    dbResult(() =>
      tx().select().from(databaseView).where(eq(databaseView.id, id)).limit(1),
    ).map((d) => d.at(0));

  const createView = (view: NewDatabaseViewRow) =>
    dbResult(() => tx().insert(databaseView).values([view]).returning()).map(
      (arr) => arr[0],
    );

  return { getView, createView };
}
