import { find, recursiveKeys } from "./object";

const testObject1 = {
  a: {
    b: 5,
    c: {
      d: () => "Hello world!",
    },
  },
  e: {},
  f: {
    g: 5,
    h: 3,
  },
};

const testObject2 = {
  a: {
    b: {
      c: 5,
    },
    d: {
      e: 2,
    },
  },
  f: 1,
};

const testObject2Keys = [
  ["a"],
  ["a", "b"],
  ["a", "b", "c"],
  ["a", "d"],
  ["a", "d", "e"],
  ["f"],
];

describe("object util tests", () => {
  it("should retrieve value from given key path", () => {
    const val1 = find(testObject1, ["a", "c", "d"]);
    const val2 = find(testObject1, ["e"]);
    const val3 = find(testObject1, ["f", "g"]);
    expect(typeof val1 === "function");
    expect(val1).toBe(testObject1.a.c.d);
    expect(val2).toBe(testObject1.e);
    expect(val3).toBe(testObject1.f.g);
  });

  it("should get all keys in an object recursively", () => {
    const keys = recursiveKeys(testObject2);
    expect(keys).toStrictEqual(testObject2Keys);
  });

  it("should get all keys in an object for a given predicate", () => {
    const case1 = recursiveKeys(testObject2, (val) => typeof val === "number");
    const case2 = recursiveKeys(testObject2, (val) => val === 2);
    expect(case1).toStrictEqual([["a", "b", "c"], ["a", "d", "e"], ["f"]]);
    expect(case2).toStrictEqual([["a", "d", "e"]]);
  });
});
