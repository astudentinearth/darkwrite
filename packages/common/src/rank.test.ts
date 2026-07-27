import { Rank } from "./rank";

describe("rank utility tests", () => {
  it("should compare two ranks correctly", () => {
    const a = new Rank("a0");
    const b = new Rank("a1");
    const lt = a.lt(b);
    const gt = a.gt(b);
    expect(lt);
    expect(!gt);
  });

  it("should stringify ranks correctly", () => {
    const a = Rank.stringify("a0");
    const b = Rank.stringify(new Rank("a1"));
    expect(a).toBe("a0");
    expect(b).toBe("a1");
  });

  it("should get the greater among two", () => {
    const a = new Rank("a0");
    const b = new Rank("a1");
    const result = Rank.greaterOne(a, b);
    expect(result).toBe("a1");
  });

  it("should get the lesser among two", () => {
    const a = new Rank("a0");
    const b = new Rank("a1");
    const result = Rank.lesserOne(a, b);
    expect(result).toBe("a0");
  });

  it("should sort keys correctly", () => {
    const list = ["a1", "a0", "a2"];
    list.sort(Rank.sorter);
    expect(list[0]).toBe("a0");
    expect(list[1]).toBe("a1");
    expect(list[2]).toBe("a2");
  });

  it("should get the key between two keys", () => {
    const a = new Rank("a0");
    const b = new Rank("a2");
    const result1 = a.between(b);
    const result2 = Rank.between(a, b);
    expect(result1.get()).toBe("a1");
    expect(result2.get()).toBe("a1");
  });
});
