import { NoteDTO } from "@/common/dto";
import { OrderKey } from "@/common/note";
import { Rank } from "@/common/rank";

/**
 * Calculates an optimistic rank for a note being moved into a different tree layer
 * @param siblingIds list of sibling note IDs **sorted by the key in `orderBy`
 * @param placement
 * @param getNoteById a function that returns NoteDTO by ID (usually the redux selector)
 * @param orderBy overrides the order key to use for rank calculation
 * @returns
 */
export function calculateOptimisticRankInLayer(
  siblingIds: string[],
  placement: "start" | "end",
  getNoteById: (id: string) => NoteDTO | undefined,
  orderBy: OrderKey = "orderHint",
) {
  if (siblingIds.length === 0) return Rank.default().get();
  let newOrderHint: string;

  if (placement === "start") {
    const firstSibling = getNoteById(siblingIds[0]);
    if (!firstSibling) return Rank.default().get();
    const rank = new Rank(firstSibling[orderBy]).prev();
    newOrderHint = rank.get();
  } else {
    const lastSibling = getNoteById(siblingIds[siblingIds.length - 1]);
    if (!lastSibling) return Rank.default().get();
    const rank = new Rank(lastSibling[orderBy]).next();
    newOrderHint = rank.get();
  }

  return newOrderHint;
}
