import { AsyncLocalStorage } from "node:async_hooks";
import { type DatabaseType, db, isDataSource, type Transaction } from "./data-source";
import { ResultAsync } from "neverthrow";
import { buildDwError, type DwError, panic } from "@darkwrite/common";

export const txContext = new AsyncLocalStorage<Transaction>();

export function getActiveTransaction(): Transaction | undefined {
  return txContext.getStore();
}

/** @returns the active transaction for the current async context if any, the default db instance if no transaction is being shared */
export function getActiveDb(): DatabaseType | Transaction {
  return txContext.getStore() ?? db;
}


export type TxResolver = () => Transaction | DatabaseType;

/** Resolves the correct transaction context to be used. The priority is:
 * - If a Transaction is explicitly passed, then it will be preferred and returned back.
 * - If a data source instance is passed, the active transaction will be preferred. When there
 *   is no transaction, the data source will be returned as fallback.
 * - If nothing is passed, and there is an active transaction, the transaction will win.
 * - If nothing is passed, and there are no transactions, **I will panic.**
 */
export function resolveTx(
  dbOrTransaction?: DatabaseType | Transaction,
): Transaction | DatabaseType {
  if (dbOrTransaction && !isDataSource(dbOrTransaction)) {
    return dbOrTransaction;
  }
  const resolved = txContext.getStore() ?? dbOrTransaction;
  if (!resolved) {
    panic(
      "No database or transaction available. Either inject one or call within a transactional() context.",
    );
  }
  return resolved;
}

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

/** Runs the passed callback within a transaction context. Initiates a new transaction if one isn't already ongoing. Does not support nested transactions, nested calls will always join the same transaction. */
export function transactional<T, E>(
  fn: () => ResultAsync<T, E>,
  _db: DatabaseType,
): ResultAsync<T, E | DwError> {
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
    (thrown: unknown): E | DwError => {
      if (isTxRollbackBox(thrown)) return thrown.errValue as E;
      return buildDwError("Database error", String(thrown));
    },
  );
}

/** @deprecated */
export abstract class TransactionalDAO {
  constructor(private _dbOrTransaction?: DatabaseType | Transaction) {}

  protected get tx(): Transaction | DatabaseType {
    return resolveTx(this._dbOrTransaction);
  }
}
