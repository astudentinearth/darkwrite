import { dwErrAsync, NoteType } from "@darkwrite/common";
import { and, eq, inArray } from "drizzle-orm";
import { okAsync } from "neverthrow";
import { dbResult } from "@/db/db-result";
import { databaseView, type NewDatabaseViewRow, note } from "@/db/schema";
import type { TxResolver } from "@/db/transactional";
import { noteTypeOf } from "./note.dao";

export function DatabaseViewDAO(tx: TxResolver) {
  const getView = (id: string) =>
    dbResult(() =>
      tx().select().from(databaseView).where(eq(databaseView.id, id)).limit(1),
    ).andThen((d) =>
      d.at(0) ? okAsync(d[0]) : dwErrAsync("Database view not found."),
    );

  const createView = (view: NewDatabaseViewRow) =>
    dbResult(() => tx().insert(databaseView).values([view]).returning()).map(
      (arr) => arr[0],
    );

  const getAllViewsOf = (databaseId: string) =>
    dbResult(() =>
      tx()
        .select()
        .from(note)
        .where(
          and(eq(note.parentId, databaseId), noteTypeOf(NoteType.DatabaseView)),
        )
        .innerJoin(databaseView, eq(note.id, databaseView.id)),
    );

  const getViewsByIds = (ids: string[]) =>
    dbResult(() =>
      tx()
        .select()
        .from(note)
        .where(and(inArray(note.id, ids), noteTypeOf(NoteType.DatabaseView)))
        .innerJoin(databaseView, eq(note.id, databaseView.id)),
    );

  return { getView, createView, getAllViewsOf, getViewsByIds };
}
