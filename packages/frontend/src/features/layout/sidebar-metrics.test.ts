import { describe, expect, it } from "vitest";
import {
  BASE_MAX_WIDTH,
  BASE_MIN_WIDTH,
  clampSidebarWidth,
  sidebarWidthRange,
} from "./sidebar-metrics";

describe("sidebarWidthRange", () => {
  it("leaves the range untouched when nothing intrudes from the left", () => {
    // windows and macos never inset the left edge
    expect(sidebarWidthRange(0)).toEqual({
      min: BASE_MIN_WIDTH,
      max: BASE_MAX_WIDTH,
    });
  });

  it("ignores an inset the header's own padding already covers", () => {
    expect(sidebarWidthRange(8).min).toBe(BASE_MIN_WIDTH);
    expect(sidebarWidthRange(68).min).toBe(BASE_MIN_WIDTH);
  });

  it("makes room for window buttons drawn on the left", () => {
    // inset + 3 buttons (32px) + 2 gaps (4px) + trailing padding (8px)
    expect(sidebarWidthRange(120).min).toBe(232);
    expect(sidebarWidthRange(200).min).toBe(312);
  });

  it("keeps the range usable once the minimum passes the base maximum", () => {
    const { min, max } = sidebarWidthRange(200);
    expect(max).toBeGreaterThan(min);
    expect(max).toBe(min + 120);
  });

  it("never returns a maximum below the minimum", () => {
    for (const inset of [0, 8, 68, 120, 200, 400]) {
      const { min, max } = sidebarWidthRange(inset);
      expect(max).toBeGreaterThanOrEqual(min);
    }
  });
});

describe("clampSidebarWidth", () => {
  const range = sidebarWidthRange(120); // { min: 232, max: 352 }

  it("pulls a width persisted under a narrower minimum back into range", () => {
    expect(clampSidebarWidth(180, range)).toBe(232);
  });

  it("caps a width above the maximum", () => {
    expect(clampSidebarWidth(500, range)).toBe(352);
  });

  it("leaves a width already in range alone", () => {
    expect(clampSidebarWidth(280, range)).toBe(280);
  });
});
