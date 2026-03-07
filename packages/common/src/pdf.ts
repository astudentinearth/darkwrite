/** All in inches, unfortunately */
export interface Margins {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export const PageMargins = {
  A4: {
    top: 1.17,
    bottom: 1.17,
    left: 0.83,
    right: 0.83,
  } satisfies Margins,
  Letter: {
    top: 0.75,
    bottom: 0.75,
    left: 0.75,
    right: 0.75,
  } satisfies Margins,
  A3: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  } satisfies Margins,
  A5: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  } satisfies Margins,
  Legal: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  } satisfies Margins,
  Tabloid: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  } satisfies Margins,
};

export type PageSize = keyof typeof PageMargins;
