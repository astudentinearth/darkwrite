import type { MovePlacement, NoteDTO, OrderKey } from "@darkwrite/common";
import { Rank } from "@darkwrite/common";

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
  placement: MovePlacement,
  getNoteById: (id: string) => NoteDTO | undefined,
  orderBy: OrderKey = "orderHint",
) {
  if (siblingIds.length === 0) return Rank.default().get();
  let newOrderHint: string;

  if (placement === "inside-start") {
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

/**
 * Calculates an optimistic rank for a note being moved below another note
 * @param aboveNoteId
 * @param siblingIds list of sibling note IDs **sorted by the key in `orderBy`**
 * @param getNoteById a function that returns NoteDTO by ID (usually the redux selector)
 * @param orderBy overrides the order key to use for rank calculation
 * @returns
 */
export function calculateRelativeOptimisticRank(
  aboveNoteId: string,
  siblingIds: string[],
  getNoteById: (id: string) => NoteDTO | undefined,
  orderBy: OrderKey = "orderHint",
) {
  const aboveNote = getNoteById(aboveNoteId);
  if (!aboveNote) return Rank.default().get();

  const aboveIndex = siblingIds.indexOf(aboveNoteId);

  let newOrderHint: string;
  if (aboveIndex >= 0 && aboveIndex < siblingIds.length - 1) {
    const nextNote = getNoteById(siblingIds[aboveIndex + 1]);
    if (nextNote) {
      const rank = new Rank(aboveNote[orderBy]).between(
        new Rank(nextNote[orderBy]),
      );
      newOrderHint = rank.get();
    } else {
      const rank = new Rank(aboveNote[orderBy]).next();
      newOrderHint = rank.get();
    }
  } else {
    const rank = new Rank(aboveNote[orderBy]).next();
    newOrderHint = rank.get();
  }

  return newOrderHint;
}
