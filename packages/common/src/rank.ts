import { generateKeyBetween } from "fractional-indexing";

export class Rank {
  static default() {
    return new Rank(generateKeyBetween(null, null));
  }

  /**
   * Narrows the type of a rank to a string.
   * @param rank
   */
  static stringify(rank: string | Rank) {
    return rank instanceof Rank ? rank.get() : rank;
  }

  static between(a: string | Rank, b: string | Rank) {
    const first = Rank.lesserOne(a, b);
    const second = Rank.greaterOne(a, b);
    if (first == null || second == null)
      throw new Error(
        "`Rank.between()` requires two ranks that are not equal.",
      );
    return new Rank(generateKeyBetween(first, second));
  }

  between(other: string | Rank) {
    const _other = Rank.stringify(other);
    return Rank.between(this, _other);
  }

  constructor(private _rank: string) {}

  get() {
    return this._rank;
  }

  next() {
    return new Rank(generateKeyBetween(this._rank, null));
  }

  prev() {
    return new Rank(generateKeyBetween(null, this._rank));
  }

  static lt(a: string | Rank, b: string | Rank) {
    const _a = Rank.stringify(a);
    const _b = Rank.stringify(b);
    return _a < _b;
  }

  static gt(a: string | Rank, b: string | Rank) {
    const _a = Rank.stringify(a);
    const _b = Rank.stringify(b);
    return _a > _b;
  }

  lt(rank: string | Rank) {
    return Rank.lt(this, rank);
  }

  gt(rank: string | Rank) {
    return Rank.gt(this, rank);
  }

  static greaterOne(a: string | Rank, b: string | Rank) {
    const _a = Rank.stringify(a);
    const _b = Rank.stringify(b);
    if (_a === _b) return null;
    return _a < _b ? _b : _a;
  }

  static lesserOne(a: string | Rank, b: string | Rank) {
    const _a = Rank.stringify(a);
    const _b = Rank.stringify(b);
    if (_a === _b) return null;
    return _a < _b ? _a : _b;
  }

  static sorter(a: string | Rank, b: string | Rank) {
    const _a = Rank.stringify(a);
    const _b = Rank.stringify(b);
    return _a < _b ? -1 : _a > _b ? 1 : 0; // https://github.com/rocicorp/fractional-indexing/blob/main/README.md#sorting
  }

  toString() {
    return this._rank;
  }
}
