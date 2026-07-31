import { type Note, type OrderKey, stableSortByOrderKeyFn } from "./note";
import { Rank } from "./rank";

/**
 * Regenerates order keys for given set of notes. **The set is assumed to live in the same tree layer.**
 * @param notes that live in the same tree layer, sorting not assumed
 * @param key which field to order by. `"orderHint"` or `"favoriteOrderHint"`
 * @returns a set of diffs that can be applied directly to notes, matching the key parameter
 */
export function rebalanceLayer(
  notes: Note[],
  key?: "orderHint",
): Array<{ id: string; orderHint: string }>;
export function rebalanceLayer(
  notes: Note[],
  key: "favoriteOrderHint",
): Array<{ id: string; favoriteOrderHint: string }>;
export function rebalanceLayer(
  notes: Note[],
  key: OrderKey = "orderHint",
): Array<{ id: string; [key]: string }> {
  let current = Rank.default();
  return notes.toSorted(stableSortByOrderKeyFn(key)).map((n) => {
    const entry = { id: n.id, [key]: current.get() };
    current = current.next();
    return entry;
  });
}
