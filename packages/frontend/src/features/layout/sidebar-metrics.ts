const BUTTON_SIZE = 32; // HeaderbarButton is h-8 w-8
const GAP = 4; // gap-1
const PADDING = 8; // p-2
const BUTTON_COUNT = 3; // app menu, search, collapse toggle

export const BASE_MIN_WIDTH = 180;
export const BASE_MAX_WIDTH = 300;
export const DEFAULT_WIDTH = 240;

/** How much room the header row needs beside a left-hand window controls
 * inset. On Linux the system draws its window buttons over our titlebar, and
 * KDE (among others) lets the user put them on the left, which eats into the
 * sidebar. */
const headerWidth = (insetLeft: number) =>
  Math.max(insetLeft, PADDING) +
  BUTTON_COUNT * BUTTON_SIZE +
  (BUTTON_COUNT - 1) * GAP +
  PADDING;

export interface SidebarWidthRange {
  min: number;
  max: number;
}

/** Allowed sidebar width range for a given window controls inset. The minimum
 * always leaves room for the full header row, so the buttons can never be
 * squeezed under the system's window buttons. With no inset this is the
 * plain 180..300 the app has always used. */
export function sidebarWidthRange(insetLeft: number): SidebarWidthRange {
  const min = Math.max(BASE_MIN_WIDTH, headerWidth(insetLeft));
  return { min, max: Math.max(BASE_MAX_WIDTH, min + 120) };
}

export const clampSidebarWidth = (width: number, range: SidebarWidthRange) =>
  Math.min(Math.max(width, range.min), range.max);
