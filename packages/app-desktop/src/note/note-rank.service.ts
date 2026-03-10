import { Rank } from "@darkwrite/common";
import { NoteDAO } from "./note.dao";

const noteDAO = new NoteDAO();

export const NoteRankService = {
  /**
   * @deprecated use NoteDAO.computeOrderKeysForLayer instead
   */
  async determineCreationRank(workspaceId: string) {
    const lastNote = await noteDAO.findLastNoteInOrder(workspaceId);
    if (!lastNote) return Rank.default().toString();
    return new Rank(lastNote.orderHint).next().toString();
  },
};
