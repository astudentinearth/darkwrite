import { Rank } from "@/common/rank";
import { NoteDAO } from "./note.dao";

const noteDAO = new NoteDAO();

export const NoteRankService = {
  async determineCreationRank(workspaceId: string) {
    const lastNote = await noteDAO.findLastNoteInOrder(workspaceId);
    if (!lastNote) return Rank.default().toString();
    return new Rank(lastNote.orderHint).next().toString();
  },
};
