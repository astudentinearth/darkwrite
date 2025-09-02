import { LexoRank } from "lexorank";
import {
  ANCHOR_ELEMENT_ID,
  fixCollisionsInGroup,
  identifyCollisions,
  IdRankPair,
} from "./rank";

describe("tests for order hint collision and their correction", () => {

  // identification tests

  it("should identify collision groups in a list with 2 elements", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzb" },
      { id: "b", rank: "0|hzzzzb" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 1);
    const group = groups[0];
    expect(group.length === 3);
    expect(group[0].id).toBe(ANCHOR_ELEMENT_ID);
    expect(group[0].rank).toBe(LexoRank.middle().toString());
    console.log(group);
  });

  it("should identify collision groups in a list where all ranks are the same", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzb" },
      { id: "b", rank: "0|hzzzzb" },
      { id: "c", rank: "0|hzzzzb" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 1);
    const group = groups[0];
    expect(group.length === 4);
    expect(group[0].id).toBe(ANCHOR_ELEMENT_ID);
    expect(group[0].rank).toBe(LexoRank.middle().toString());
    console.log(group);
  });

  it("should identify a collision group in the middle of the list", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzb" },
      { id: "b", rank: "0|hzzzzc" },
      { id: "c", rank: "0|hzzzzc" },
      { id: "d", rank: "0|hzzzzd" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 1);
    const group = groups[0];
    expect(group.length === 3);
    expect(group[0].id === "a");
    expect(group[1].rank === "0|hzzzzc");
    expect(group[2].rank === "0|hzzzzc");
    console.log(group);
  });

  it("should identify 2 independent collision groups", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzb" },
      { id: "b", rank: "0|hzzzzc" },
      { id: "c", rank: "0|hzzzzc" },
      { id: "d", rank: "0|hzzzzd" },
      { id: "e", rank: "0|hzzzzd" },
      { id: "f", rank: "0|hzzzzd" },
    ];

    const groups = identifyCollisions(pairs);
    expect(groups.length === 2);
    const group1 = groups[0];
    const group2 = groups[1];
    expect(group1.length === 3);
    expect(group2.length === 4);
    expect(group1[0].id === "a");
    expect(group1[1].rank === "0|hzzzzc");
    expect(group1[2].rank === "0|hzzzzc");
    expect(group2[0].id === "d");
    expect(group2[1].rank === "0|hzzzzd");
    expect(group2[2].rank === "0|hzzzzd");
    expect(group2[3].rank === "0|hzzzzd");
    console.log(groups);
  });

  it("should return an empty list when no items are given", () => {
    const result = identifyCollisions([]);
    expect(result.length).toBe(0);
  });

  it("should return an empty list if there are no collisions", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzb" },
      { id: "b", rank: "0|hzzzzc" },
      { id: "c", rank: "0|hzzzzd" },
      { id: "d", rank: "0|hzzzze" },
      { id: "e", rank: "0|hzzzzf" },
      { id: "f", rank: "0|hzzzzg" },
    ];

    const result = identifyCollisions(pairs);
    expect(result.length).toBe(0);
  });

  it("should identify a collision at the end", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzb" },
      { id: "b", rank: "0|hzzzzc" },
      { id: "c", rank: "0|hzzzzd" },
      { id: "d", rank: "0|hzzzzf" },
      { id: "e", rank: "0|hzzzzf" },
      { id: "f", rank: "0|hzzzzf" },
    ];

    const result = identifyCollisions(pairs);
    expect(result.length).toBe(1);
    const group = result[0];
    expect(group.length).toBe(4);
    expect(group[0].id).toBe("c");
    expect(group[1].rank).toBe("0|hzzzzf");
    expect(group[2].rank).toBe("0|hzzzzf");
    expect(group[3].rank).toBe("0|hzzzzf");

    console.log(group);
  });

  it("should identify a start, a middle and an end collision all at once", () => {
    const pairs: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzb" },
      { id: "b", rank: "0|hzzzzb" },
      { id: "c", rank: "0|hzzzzc" },
      { id: "d", rank: "0|hzzzzc" },
      { id: "e", rank: "0|hzzzzd" },
      { id: "f", rank: "0|hzzzze" },
      { id: "g", rank: "0|hzzzzf" },
      { id: "h", rank: "0|hzzzzf" },
      { id: "i", rank: "0|hzzzzf" },
      { id: "j", rank: "0|hzzzzf" },
    ];

    const result = identifyCollisions(pairs);
    expect(result.length).toBe(3);
    const group1 = result[0];
    const group2 = result[1];
    const group3 = result[2];

    // group 1
    expect(group1.length).toBe(3);
    expect(group1[0].id).toBe(ANCHOR_ELEMENT_ID);
    expect(group1[0].rank).toBe(LexoRank.middle().toString());
    expect(group1[1].rank).toBe("0|hzzzzb");
    expect(group1[2].rank).toBe("0|hzzzzb");

    // group 2
    expect(group2.length).toBe(3);
    expect(group2[0].id).toBe("b");
    expect(group2[0].rank).toBe("0|hzzzzb");
    expect(group2[1].rank).toBe("0|hzzzzc");
    expect(group2[2].rank).toBe("0|hzzzzc");

    // group 3
    expect(group3.length).toBe(5);
    expect(group3[0].id).toBe("f");
    expect(group3[0].rank).toBe("0|hzzzze");
    expect(group3[1].rank).toBe("0|hzzzzf");
    expect(group3[2].rank).toBe("0|hzzzzf");
    expect(group3[3].rank).toBe("0|hzzzzf");
    expect(group3[4].rank).toBe("0|hzzzzf");

    console.log(result);
  });

  it("should refuse to perform a correction when group size is <3", () => {
    const list: IdRankPair[] = [];
    const result = fixCollisionsInGroup(list);
    expect(result).toHaveLength(0);
  });

  // correction tests

  it("should fix collisions in a group when a placeholder anchor is present", () => {
    const list: IdRankPair[] = [
      { id: ANCHOR_ELEMENT_ID, rank: LexoRank.middle().toString() },
      { id: "a", rank: "0|hzzzzz:i" },
      { id: "b", rank: "0|hzzzzz:i" },
    ];
    const result = fixCollisionsInGroup(list);
    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe("0|hzzzzz:9");
    expect(result[1].rank).toBe("0|hzzzzz:d");
    console.log(result);
  });

  it("should fix collisions in a group", () => {
    const list: IdRankPair[] = [
      { id: "a", rank: "0|hzzzzz" },
      { id: "b", rank: "0|hzzzzz:i" },
      { id: "c", rank: "0|hzzzzz:i" },
      { id: "d", rank: "0|hzzzzz:i" },
    ];
    const result = fixCollisionsInGroup(list);
    expect(result).toHaveLength(3);
    expect(new Set(result.map((e) => e.rank))).toHaveLength(3); // all different ranks
    console.log(result);
  });
});
