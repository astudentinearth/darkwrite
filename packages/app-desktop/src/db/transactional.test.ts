import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { createTestDatabase } from "./data-source";
import {
  resolveTx,
  DbError,
  getActiveTransaction,
  transactional,
  txContext,
} from "./transactional";
import { sql } from "drizzle-orm";
import { panic } from "@darkwrite/common";

const db = createTestDatabase();
const db2 = createTestDatabase();

describe("transaction context tests", () => {
  it("should get the active transaction", async () => {
    const noTransaction = getActiveTransaction();
    const someTransaction = await db.transaction(async (tx) => {
      return await txContext.run(tx, async () => getActiveTransaction());
    });

    expect(noTransaction).toBeUndefined();
    expect(someTransaction).not.toBeUndefined();
  });

  it("should run things inside a transaction (ok)", async () => {
    const okResult = await transactional(() => {
      const isInTransaction = getActiveTransaction() !== undefined;
      return okAsync(isInTransaction);
    }, db);

    expect(okResult._unsafeUnwrap()).toBe(true);
  });

  it("should run things inside a transaction (err)", async () => {
    const errResult = await transactional(() => {
      return errAsync("oops");
    }, db);

    expect(errResult._unsafeUnwrapErr()).toBe("oops");
  });

  it("should propagate throwables", async () => {
    const thrown = (
      await transactional(() => {
        throw "oops";
      }, db)
    )._unsafeUnwrapErr();

    expect(thrown).toMatchObject({ type: "db-error", cause: "oops" });
  });

  it("should be idempotent", async () => {
    const result = await transactional(() => {
      const tx1 = getActiveTransaction();
      return transactional(() => {
        const tx2 = getActiveTransaction();
        return okAsync(tx1 === tx2);
      }, db);
    }, db);

    expect(result._unsafeUnwrap()).toBe(true);
  });

  describe("rollback", () => {
    beforeEach(async () => {
      await db.run(sql`create table if not exists _tx_rollback_test (v TEXT)`);
    });

    afterEach(async () => {
      await db.run(sql`drop table if exists _tx_rollback_test`);
    });

    it("should rollback if something is thrown", async () => {
      const result = await transactional(() => {
        const tx = getActiveTransaction();
        if (!tx) panic("Transactionals are broken");
        return ResultAsync.fromPromise(
          (async () => {
            await tx!.run(
              sql`insert into _tx_rollback_test values ('written')`,
            );
            throw "oops";
          })(),
          (e): DbError => ({ type: "db-error", cause: e }),
        );
      }, db);

      const rows = await db.run(sql`select * from _tx_rollback_test`);
      expect(rows.rows).toHaveLength(0);
      expect(result._unsafeUnwrapErr()).toMatchObject({ cause: "oops" });
    });

    it("should rollback if an error is returned", async () => {
      const result = await transactional(() => {
        const tx = getActiveTransaction();
        if (!tx) panic("Transactionals are broken");
        return ResultAsync.fromPromise(
          tx!.run(sql`insert into _tx_rollback_test values ('written')`),
          (e): DbError => ({ type: "db-error", cause: e }),
        ).andThen(() => errAsync({ type: "test-error" } as const));
      }, db);

      const rows = await db.run(sql`select * from _tx_rollback_test`);
      expect(rows.rows).toHaveLength(0);
      expect(result._unsafeUnwrapErr()).toEqual({ type: "test-error" });
    });
  });
});

describe("transactional dao tests", () => {
  it("should panic if no db or transaction exists", () => {
    expect(() => resolveTx()).toThrow();
  });

  it("should prefer the database instance outside contexts", () => {
    expect(resolveTx(db)).toBe(db);
  });

  it("should prefer active transaction inside contexts", async () => {
    const result = await transactional(() => {
      const tx = getActiveTransaction();
      return okAsync({
        withDb: tx === resolveTx(db),
        implicit: tx === resolveTx(),
      });
    }, db);

    expect(result._unsafeUnwrap()).toMatchObject({
      withDb: true,
      implicit: true,
    });
  });

  it("should prefer an explicitly passed transaction regardless of context", async () => {
    const result = (
      await db2.transaction(async (tx) => {
        return await transactional(() => {
          return okAsync(resolveTx(tx) === tx);
        }, db);
      })
    )._unsafeUnwrap();

    expect(result).toBe(true);
  });
});
