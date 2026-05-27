import { buildDwError, type DwResultAsync } from "@darkwrite/common";
import { ResultAsync } from "neverthrow";

export function dbResult<T>(fn: () => Promise<T>): DwResultAsync<T> {
  return ResultAsync.fromPromise(fn(), (cause) =>
    buildDwError("Database error", String(cause)),
  );
}
