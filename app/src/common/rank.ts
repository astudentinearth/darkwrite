import { LexoRank } from "lexorank";
import { NoteDTO } from "./dto";

export interface IdRankPair {
  id: string;
  rank: string;
}

type OrderHintKey = "orderHint" | "favoriteOrderHint";
export const ANCHOR_ELEMENT_ID = "ANCHOR";

function convertToIdRankPair(notes: NoteDTO[], key: OrderHintKey) {
  return notes
    .map((n) => ({ id: n.id, rank: n[key] }))
    .toSorted((a, b) => a.rank.localeCompare(b.rank)) satisfies IdRankPair[];
}

function convertIdRankPairToChangeset(items: IdRankPair[], key: OrderHintKey) {}

/**
 * Finds colliding ranks in the given list. **Items must be sorted in advance before calling this method!**
 * @param items
 * @returns a list of collision groups. In each collision group, the first element is the predecessor to the colliding elements.
 */
export function identifyCollisions(items: IdRankPair[]): IdRankPair[][] {
  if (items.length < 2) return [];
  const groupList = [];
  let currentCollisionGroup: IdRankPair[] = [];
  for (let i = 1; i < items.length; i++) {
    const previous = items[i - 1];
    const current = items[i];
    if (previous.rank !== current.rank) {
      if(currentCollisionGroup.length === 0) continue; // no collision chain

      // chain broken, save group and continue
      groupList.push(currentCollisionGroup);
      currentCollisionGroup = [];
      continue;
    }
    if (i === 1) {
      // there's collision at list start, anchor element will be used
      const anchor: IdRankPair = { id: ANCHOR_ELEMENT_ID, rank: LexoRank.middle().toString() }
      currentCollisionGroup.push(anchor, previous, current);
      groupList.push(currentCollisionGroup);
      currentCollisionGroup = [];
      continue;
    }
    if(currentCollisionGroup.length > 0) {
      // this is an ongoing collision, we'll push the current and continue
      currentCollisionGroup.push(current);
      continue;
    }
    // we are initializing a new group
    const twoBefore = items[i - 2];
    currentCollisionGroup.push(twoBefore, previous, current); 
  }

  if(currentCollisionGroup.length > 0) groupList.push(currentCollisionGroup);
  return groupList;
}

function fixCollisionsInGroup(items: IdRankPair[]): IdRankPair[] {}

export function generateRankCollisionChangeset(
  notes: NoteDTO[],
  key: OrderHintKey,
) {
  // We can't have a collision with less than 2 notes
  if (notes.length < 2) return [];

  const items = convertToIdRankPair(notes, key);
  const collisionGroups = identifyCollisions(items);
  const changeSet: IdRankPair[] = [];
  for (const collisionSet of collisionGroups) {
    const fixedSet = fixCollisionsInGroup(collisionSet);
    changeSet.push(...fixedSet);
  }
}
