import { NoteDTO } from "./dto";
import { Rank } from "./rank";
import {
  ANCHOR_ELEMENT_ID,
  fixCollisionsInGroup,
  generateRankCollisionChangeset,
  identifyCollisions,
  IdRankPair,
} from "./rank-correction";

describe("tests for order hint collision and their correction", () => {
  // identification tests - these dont care about key format

  it("should identify collision groups in a list with 2 elements", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "aaazzb" },
      { id: "b", rank: "aaazzb" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 1);
    const group = groups[0];
    expect(group.length === 3);
    expect(group[0].id).toBe(ANCHOR_ELEMENT_ID);
    expect(group[0].rank).toBe(Rank.default().get());
    console.log(group);
  });

  it("should identify collision groups in a list where all ranks are the same", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "aaazzb" },
      { id: "b", rank: "aaazzb" },
      { id: "c", rank: "aaazzb" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 1);
    const group = groups[0];
    expect(group.length === 4);
    expect(group[0].id).toBe(ANCHOR_ELEMENT_ID);
    expect(group[0].rank).toBe(Rank.default().toString());
    console.log(group);
  });

  it("should identify a collision group in the middle of the list", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "aaazzb" },
      { id: "b", rank: "aaazzc" },
      { id: "c", rank: "aaazzc" },
      { id: "d", rank: "aaazzd" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 1);
    const group = groups[0];
    expect(group.length === 3);
    expect(group[0].id === "a");
    expect(group[1].rank === "aaazzc");
    expect(group[2].rank === "aaazzc");
    console.log(group);
  });

  it("should identify 2 independent collision groups", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "aaazzb" },
      { id: "b", rank: "aaazzc" },
      { id: "c", rank: "aaazzc" },
      { id: "d", rank: "aaazzd" },
      { id: "e", rank: "aaazzd" },
      { id: "f", rank: "aaazzd" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 2);
    const group1 = groups[0];
    const group2 = groups[1];
    expect(group1.length === 3);
    expect(group2.length === 4);
    expect(group1[0].id === "a");
    expect(group1[1].rank === "aaazzc");
    expect(group1[2].rank === "aaazzc");
    expect(group2[0].id === "d");
    expect(group2[1].rank === "aaazzd");
    expect(group2[2].rank === "aaazzd");
    expect(group2[3].rank === "aaazzd");
    console.log(groups);
  });

  it("should return an empty list when no items are given", () => {
    const result = identifyCollisions([]);
    expect(result.length).toBe(0);
  });

  it("should return an empty list if there are no collisions", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "aaazzb" },
      { id: "b", rank: "aaazzc" },
      { id: "c", rank: "aaazzd" },
      { id: "d", rank: "aaazze" },
      { id: "e", rank: "aaazzf" },
      { id: "f", rank: "aaazzg" },
    ];

    const result = identifyCollisions(pairs);
    expect(result.length).toBe(0);
  });

  it("should identify a collision at the end", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "aaazzb" },
      { id: "b", rank: "aaazzc" },
      { id: "c", rank: "aaazzd" },
      { id: "d", rank: "aaazzf" },
      { id: "e", rank: "aaazzf" },
      { id: "f", rank: "aaazzf" },
    ];

    const result = identifyCollisions(pairs);
    expect(result.length).toBe(1);
    const group = result[0];
    expect(group.length).toBe(4);
    expect(group[0].id).toBe("c");
    expect(group[1].rank).toBe("aaazzf");
    expect(group[2].rank).toBe("aaazzf");
    expect(group[3].rank).toBe("aaazzf");

    console.log(group);
  });

  it("should identify a start, a middle and an end collision all at once", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "aaazzb" },
      { id: "b", rank: "aaazzb" },
      { id: "c", rank: "aaazzc" },
      { id: "d", rank: "aaazzc" },
      { id: "e", rank: "aaazzd" },
      { id: "f", rank: "aaazze" },
      { id: "g", rank: "aaazzf" },
      { id: "h", rank: "aaazzf" },
      { id: "i", rank: "aaazzf" },
      { id: "j", rank: "aaazzf" },
    ];

    const result = identifyCollisions(pairs);
    expect(result.length).toBe(3);
    const group1 = result[0];
    const group2 = result[1];
    const group3 = result[2];

    // group 1
    expect(group1.length).toBe(3);
    expect(group1[0].id).toBe(ANCHOR_ELEMENT_ID);
    expect(group1[0].rank).toBe(Rank.default().toString());
    expect(group1[1].rank).toBe("aaazzb");
    expect(group1[2].rank).toBe("aaazzb");

    // group 2
    expect(group2.length).toBe(3);
    expect(group2[0].id).toBe("b");
    expect(group2[0].rank).toBe("aaazzb");
    expect(group2[1].rank).toBe("aaazzc");
    expect(group2[2].rank).toBe("aaazzc");

    // group 3
    expect(group3.length).toBe(5);
    expect(group3[0].id).toBe("f");
    expect(group3[0].rank).toBe("aaazze");
    expect(group3[1].rank).toBe("aaazzf");
    expect(group3[2].rank).toBe("aaazzf");
    expect(group3[3].rank).toBe("aaazzf");
    expect(group3[4].rank).toBe("aaazzf");

    console.log(result);
  });

  it("should refuse to perform a correction when group size is <3", () => {
    const list: IdRankPair[] = [];
    const result = fixCollisionsInGroup(list);
    expect(result).toHaveLength(0);
  });

  // correction tests - these care about key format

  it("should fix collisions in a group when a placeholder anchor is present", () => {
    const collidingRank = Rank.default().next().next();
    const list: IdRankPair[] = [
      { id: ANCHOR_ELEMENT_ID, rank: Rank.default().toString() },
      { id: "a", rank: collidingRank.get() },
      { id: "b", rank: collidingRank.get() },
    ];
    const result = fixCollisionsInGroup(list);
    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(collidingRank.between(Rank.default()).get());
    expect(result[1].rank).toBe(
      collidingRank.between(Rank.default()).between(collidingRank).get(),
    );
    console.log(result);
  });

  it("should fix collisions in a group", () => {
    const collidingRank = Rank.default().next().next();
    const list: IdRankPair[] = [
      { id: "a", rank: "aaazzz" },
      { id: "b", rank: collidingRank.get() },
      { id: "c", rank: collidingRank.get() },
      { id: "d", rank: collidingRank.get() },
    ];
    const result = fixCollisionsInGroup(list);
    expect(result).toHaveLength(3);
    expect(new Set(result.map((e) => e.rank))).toHaveLength(3); // all different ranks
    console.log(result);
  });

  // full run

  it("should fix a list of notes that have colliding order keys", () => {
    const notes = [
      {
        id: "a",
        orderHint: "a2",
      },
      { id: "b", orderHint: "a0" },
      { id: "c", orderHint: "a2" },
    ] as NoteDTO[]; // we don't care about other keys

    const result = generateRankCollisionChangeset(notes, "orderHint");
    const keys = new Set(result.map(e => e["orderHint"]));
    expect(keys).toHaveLength(2);
    expect(result).toHaveLength(2);
    expect(keys).not.contain("a0"); // we don't want the healthy note to be affected
    console.log(result);
  });
});
