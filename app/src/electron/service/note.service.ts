import { CreateNoteDTO, UpdateNoteDTO } from "@/common/dto";
import { Database, Note, Workspace } from "../entity";
import { DatabaseRepository } from "../repository/database.repository";
import { NoteRepository } from "../repository/note.repository";
import { WorkspaceRepository } from "../repository/workspace.repository";
import { WorkspaceService } from "./workspace.service";
import { DatabaseService } from "./database.service";
import { NoteEntity } from "../db/entity/note";
import { ServiceContainer } from "../service-container";

export class NoteService {
  constructor(
    private noteRepository: NoteRepository = new NoteRepository(),
    private databaseRepository: DatabaseRepository = new DatabaseRepository(),
    private workspaceRepository: WorkspaceRepository = new WorkspaceRepository(),
    private workspaceService: WorkspaceService = ServiceContainer.workspaceService,
    private databaseService: DatabaseService = ServiceContainer.databaseService
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

  async getAllByWorkspaceId(workspaceId: string) {
    return this.noteRepository.findAllByWorkspaceId(workspaceId);
  }

  async update(id: string, dto: UpdateNoteDTO) {
    const {workspaceId, databaseId, ...rest} = dto;
    let workspace: Workspace | undefined = undefined;
    let database: Database | undefined = undefined;
    if(workspaceId) workspace = await this.workspaceService.findWorkspaceOrThrow(workspaceId);
    if(databaseId) database = await this.databaseService.findDatabaseOrThrow(databaseId);
    
    const note = await this.noteRepository.findById(id);
    if(!note) throw new Error(`Note ${id} does not exist.`);
    Object.assign(note, rest);
    if(workspace) note.workspace = workspace;
    if(database) note.database = database;
    if("databaseId" in dto && dto.databaseId === undefined) note.database = undefined;
    
    return await this.noteRepository.save(note);
  }

  async deleteById(id: string) {
    await this.noteRepository.deleteById(id);
  }

}
