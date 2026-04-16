import { PatchNote } from "@/db/schema";
import { NoteDAO } from "../note/note.dao";
import { Rank } from "@darkwrite/common";
import { db } from "@/db";
import { WorkspaceDAO } from "@/workspace/workspace.dao";

export class HealthService {
  private workspaceRepository: WorkspaceDAO;
  private noteRepository: NoteDAO;

  constructor(
    private _db = db,
    workspaceRepository?: WorkspaceDAO,
    noteRepository?: NoteDAO,
  ) {
    this.workspaceRepository =
      workspaceRepository ?? new WorkspaceDAO(this._db);
    this.noteRepository = noteRepository ?? new NoteDAO(this._db);
  }

  // FIXME: This method is likely unreliable and should not be called anymore.
  /** @deprecated */
  async fixCollidingOrderKeys() {
    const workspaces = await this.workspaceRepository.findAll();
    const changes: PatchNote[] = [];
    for (const workspace of workspaces) {
      const notes = await this.noteRepository.findAllByWorkspaceId(
        workspace.id,
      );
      const targets = notes.filter((n) => !n.isTrashed);
      const rankSet = new Set(targets.map((n) => n.orderHint));
      if (rankSet.size !== targets.length) {
        let prev: Rank = Rank.default();
        const _changes = targets
          .toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint))
          .map((n) => {
            const rank = prev.next();
            prev = rank;
            return { id: n.id, orderHint: rank.toString() };
          });
        changes.push(..._changes);
      }
      const favorites = notes.filter((n) => n.isFavorite && !n.isTrashed);
      const favoriteRankSet = new Set(
        favorites.map((n) => n.favoriteOrderHint),
      );
      if (favoriteRankSet.size !== favorites.length) {
        let prev: Rank = Rank.default();
        const _changes = targets
          .toSorted((a, b) =>
            Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint),
          )
          .map((n) => {
            const rank = prev.next();
            prev = rank;
            return { id: n.id, favoriteOrderHint: rank.toString() };
          });
        changes.push(..._changes);
      }
    }
    await this.noteRepository.updateAll(changes);
  }
}
