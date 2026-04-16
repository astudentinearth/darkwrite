import { sql } from "drizzle-orm";

/** Helper to deal with column names in onConflict handlers */
export const excluded = (name: string) => sql`excluded.${sql.identifier(name)}`;

/** Ensure primary key is included for patches.
 * @template T base type
 * @template K primary key name
 * */
export type PatchPartial<
  T extends Record<string, unknown>,
  K extends keyof T,
> = Partial<T> & Required<Pick<T, K>>;
