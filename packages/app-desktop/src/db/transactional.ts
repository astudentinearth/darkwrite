import { AsyncLocalStorage } from "async_hooks";
import { DatabaseType, db, Transaction } from "./data-source";
import { ResultAsync } from "neverthrow";
import { panic } from "@darkwrite/common";

export const txContext = new AsyncLocalStorage<Transaction>();

export function getActiveTransaction(): Transaction | undefined {
  return txContext.getStore();
}

/** @returns the active transaction for the current async context if any, the default db instance if no transaction is being shared */
export function getActiveDb(): DatabaseType | Transaction {
  return txContext.getStore() ?? db;
}

export type DbError = { type: "db-error"; cause: unknown };

const TX_ROLLBACK_SENTINEL = Symbol("drizzle-tx-rollback");

interface TxRollbackBox<E> {
  readonly [TX_ROLLBACK_SENTINEL]: true;
  readonly errValue: E;
}

function isTxRollbackBox(x: unknown): x is TxRollbackBox<unknown> {
  return (
    x !== null &&
    typeof x === "object" &&
    (x as Record<symbol, unknown>)[TX_ROLLBACK_SENTINEL] === true
  );
}

/** Runs the passed callback within a transaction context. Initiates a new transaction if one isn't already ongoing. */
export function transactional<T, E>(
  fn: () => ResultAsync<T, E>,
  _db: DatabaseType = db,
): ResultAsync<T, E | DbError> {
  // don't create a new transaction if one is already running
  if (txContext.getStore()) return fn();

  return ResultAsync.fromPromise(
    _db.transaction(async (tx) =>
      txContext.run(tx, async () => {
        const result = await fn();

        if (result.isErr()) {
          throw {
            [TX_ROLLBACK_SENTINEL]: true,
            errValue: result.error,
          } satisfies TxRollbackBox<typeof result.error>;
        }

        return result.value;
      }),
    ),
    (thrown: unknown): E | DbError => {
      if (isTxRollbackBox(thrown)) return thrown.errValue as E;
      return { type: "db-error", cause: thrown };
    },
  );
}

export abstract class TransactionalDAO {
  constructor(private _dbOrTransaction?: DatabaseType | Transaction) {}

  protected get tx(): Transaction | DatabaseType {
    const resolved = this._dbOrTransaction ?? getActiveTransaction();
    if (!resolved) {
      // this is a programming error, throw.
      panic(
        `${this.constructor.name}: no database or transaction available. Either inject one or call within a transactional() context.`,
      );
    }
    return resolved;
  }
}
