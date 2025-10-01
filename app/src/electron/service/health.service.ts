import { generateRankCollisionChangeset } from "@/common/rank-correction";
import { AppDataSource } from "../db";
import { Note } from "../entity";
import { NoteRepository } from "../repository/note.repository";
import { WorkspaceRepository } from "../repository/workspace.repository";
import { Rank } from "@/common/rank";

export class HealthService {
  constructor(
    private _db = AppDataSource,
    private workspaceRepository = new WorkspaceRepository(),
    private noteRepository = new NoteRepository(),
  ) {}

  async fixCollidingOrderKeys() {
    const workspaces = await this.workspaceRepository.findAll();
    const changes: Partial<Note>[] = [];
    for (const workspace of workspaces) {
      const notes = await this.noteRepository.findAllByWorkspaceId(
        workspace.id,
      );
      const targets = notes.filter(n => !n.isTrashed);
      const rankSet = new Set(targets.map((n) => n.orderHint));
      if (rankSet.size !== targets.length) {
        console.log(`Found colliding order keys in ${workspace.id}`);
        console.log(targets);
        let prev: Rank = Rank.default();
        const _changes = targets.toSorted((a, b) => Rank.sorter(a.orderHint, b.orderHint)).map(n => {
          const rank = prev.next();
          prev = rank;
          return {id: n.id, orderHint: rank.toString() }
        })
        changes.push(..._changes);
      }
      const favorites = notes.filter((n) => n.isFavorite && !n.isTrashed);
      const favoriteRankSet = new Set(favorites.map((n) => n.favoriteOrderHint));
      if (favoriteRankSet.size !== favorites.length) {
        console.log(`Found colliding favorite order keys in ${workspace.id}`);
        let prev: Rank = Rank.default();
        const _changes = targets.toSorted((a, b) => Rank.sorter(a.favoriteOrderHint, b.favoriteOrderHint)).map(n => {
          const rank = prev.next();
          prev = rank;
          return {id: n.id, favoriteOrderHint: rank.toString() }
        })
        changes.push(..._changes);
      }
    }
    console.log(`Applying ${changes.length} changes to fix colliding order keys...`);
    await this._db.getRepository(Note).save(changes);
  }
}
