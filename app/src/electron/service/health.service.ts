import { AppDataSource } from "../db";
import { Note } from "../entity";
import { NoteDAO } from "../note/note.dao";
import { Rank } from "@/common/rank";
import { WorkspaceDAO } from "../workspace/workspace.dao";

export class HealthService {
  constructor(
    private _db = AppDataSource,
    private workspaceRepository = WorkspaceDAO,
    private noteRepository = new NoteDAO(),
  ) {}

  async fixCollidingOrderKeys() {
    const workspaces = await this.workspaceRepository.findAll();
    const changes: Partial<Note>[] = [];
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
    await this._db.getRepository(Note).save(changes);
  }
}
