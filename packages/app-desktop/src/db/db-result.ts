import { ResultAsync } from "neverthrow";
import { DbError } from "./transactional";

export function dbResult<T>(fn: () => Promise<T>): ResultAsync<T, DbError> {
  return ResultAsync.fromPromise(fn(), (cause) => ({
    type: "db-error",
    cause,
  }));
}
