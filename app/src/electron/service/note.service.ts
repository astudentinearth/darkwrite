import { CreateNoteDTO } from "@/common/dto";
import { Database, Note } from "../entity";
import { DatabaseRepository } from "../repository/database.repository";
import { NoteRepository } from "../repository/note.repository";
import { WorkspaceRepository } from "../repository/workspace.repository";

export class NoteService {
  constructor(
    private noteRepository: NoteRepository = new NoteRepository(),
    private databaseRepository: DatabaseRepository = new DatabaseRepository(),
    private workspaceRepository: WorkspaceRepository = new WorkspaceRepository(),
  ) {}

  async create(dto: CreateNoteDTO) {
    const {title, workspaceId, databaseId, icon, parentId, orderHint, favoriteOrderHint} = dto;

    const workspace = await this.workspaceRepository.findById(workspaceId);
    if(!workspace) throw new Error(`Workspace ${workspaceId} not found.`);

    let database: Database | undefined = undefined;
    if(databaseId) {
      const result = await this.databaseRepository.findById(databaseId);
      if(!result) throw new Error(`Database ${databaseId} not found.`);
      else database = result;
    }

    const note = new Note();
    note.title = title;
    note.workspace = workspace;
    note.orderHint = orderHint;
    note.favoriteOrderHint = favoriteOrderHint;
    note.database = database;
    note.createdAt = new Date();
    note.modifiedAt = new Date();
    note.icon = icon;
    note.parentId = parentId;
    note.isFavorite = false;
    note.isTrashed = false;
    
    return await this.noteRepository.save(note);
  }

}
