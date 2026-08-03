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

describe("Rank.isValid", () => {
  it("accepts well-formed keys", () => {
    expect(Rank.isValid("a0")).toBe(true);
    expect(Rank.isValid(Rank.default().get())).toBe(true);
    expect(Rank.isValid(Rank.default().next().get())).toBe(true);
    expect(Rank.isValid(Rank.default().prev().get())).toBe(true);
  });

  it("rejects the empty string", () => {
    expect(Rank.isValid("")).toBe(false);
  });

  it("rejects malformed keys", () => {
    expect(Rank.isValid("!")).toBe(false);
    expect(Rank.isValid("zz")).toBe(false);
    expect(Rank.isValid(" a0")).toBe(false);
  });
});

describe("Rank.midpoint", () => {
  it("returns the key between two distinct ranks", () => {
    const result = Rank.midpoint(new Rank("a0"), new Rank("a2"));
    expect(result.collided).toBe(false);
    if (!result.collided) expect(result.midpoint.get()).toBe("a1");
  });

  it("is order-independent for distinct ranks", () => {
    const forward = Rank.midpoint(new Rank("a0"), new Rank("a2"));
    const reverse = Rank.midpoint(new Rank("a2"), new Rank("a0"));
    if (!forward.collided && !reverse.collided) {
      expect(forward.midpoint.get()).toBe(reverse.midpoint.get());
    } else {
      throw new Error("distinct ranks must not report a collision");
    }
  });

  it("signals a collision for equal ranks and omits midpoint", () => {
    const result = Rank.midpoint(new Rank("a5"), new Rank("a5"));
    expect(result.collided).toBe(true);
    expect("midpoint" in result).toBe(false);
  });

  it("exposes the same result through the instance method", () => {
    const a = new Rank("a0");
    const viaInstance = a.midpoint(new Rank("a2"));
    const viaStatic = Rank.midpoint(a, new Rank("a2"));
    if (!viaInstance.collided && !viaStatic.collided) {
      expect(viaInstance.midpoint.get()).toBe(viaStatic.midpoint.get());
    } else {
      throw new Error("expected no collision");
    }
  });
});
