import { describe, expect, it } from "vitest";
import { cleanFavoriteIds } from "./favorite-ids";

describe("cleanFavoriteIds", () => {
  it("should return valid IDs unchanged when no duplicates or missing", () => {
    const existing = new Set(["a", "b", "c"]);
    const result = cleanFavoriteIds(["a", "b", "c"], existing);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should remove duplicates keeping the first occurrence", () => {
    const existing = new Set(["a", "b", "c"]);
    const result = cleanFavoriteIds(["a", "b", "a", "c", "b"], existing);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should filter out IDs not in the existing set", () => {
    const existing = new Set(["a"]);
    const result = cleanFavoriteIds(["a", "nonexistent", "b"], existing);
    expect(result).toEqual(["a"]);
  });

  it("should handle an empty input array", () => {
    const existing = new Set(["a", "b"]);
    const result = cleanFavoriteIds([], existing);
    expect(result).toEqual([]);
  });

  it("should handle an empty existing set", () => {
    const result = cleanFavoriteIds(["a", "b"], new Set());
    expect(result).toEqual([]);
  });

  it("should combine deduplication and existence filtering", () => {
    const existing = new Set(["a", "c", "d"]);
    const result = cleanFavoriteIds(
      ["a", "b", "a", "c", "b", "d", "e"],
      existing,
    );
    expect(result).toEqual(["a", "c", "d"]);
  });
});
