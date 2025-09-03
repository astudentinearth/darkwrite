import { generateRankCollisionChangeset } from "@/common/rank-correction";
import { AppDataSource } from "../db";
import { Note } from "../entity";
import { NoteRepository } from "../repository/note.repository";
import { WorkspaceRepository } from "../repository/workspace.repository";

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
      const favoriteRankSet = new Set(notes.map((n) => n.favoriteOrderHint));
      const targets = notes.filter(n => !n.isTrashed);
      const rankSet = new Set(targets.map((n) => n.orderHint));
      if (rankSet.size !== targets.length) {
        console.log(`Found colliding order keys in ${workspace.id}`);
        console.log(targets);
        changes.push(
          ...generateRankCollisionChangeset(
            targets.map((n) => n.mapToDTO()),
            "orderHint",
          ),
        );
      }
      const favorites = notes.filter((n) => n.isFavorite && !n.isTrashed);
      if (favoriteRankSet.size !== favorites.length) {
        console.log(`Found colliding favorite order keys in ${workspace.id}`);
        changes.push(
          ...generateRankCollisionChangeset(
            favorites.map((n) => n.mapToDTO()),
            "favoriteOrderHint",
          ),
        );
      }
    }
    console.log(`Applying ${changes.length} changes to fix colliding order keys...`);
    await this._db.getRepository(Note).save(changes);
  }
}
