import { createTestDatabase, isDataSource } from "./data-source";

describe("type guard tests", () => {
  const db = createTestDatabase();

  it("should distinguish data source singletons", () => {
    expect(isDataSource(db)).toBe(true);
  });

  it("should not mistake transactions for data sources", async () => {
    const result = await db.transaction(async (tx) => {
      return isDataSource(tx);
    });

    expect(result).toBe(false);
  });
});
