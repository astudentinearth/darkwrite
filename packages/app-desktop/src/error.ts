import { InternalError, isTaggedError } from "@darkwrite/common";
import { DbError } from "./db/transactional";

export function mapDbError<T>(error: T): Exclude<T, DbError> {
  if (!isTaggedError(error) || error.type !== "db-error")
    return error as Exclude<T, DbError>;
  return {
    type: "internal-error",
    message: "Database error",
  } satisfies InternalError as Exclude<T, DbError>;
}
