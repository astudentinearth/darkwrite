import { CreateNoteDTO, UpdateNoteDTO } from "@/common/dto";
import { Database, Note, Workspace } from "../entity";
import { DatabaseRepository } from "../repository/database.repository";
import { NoteRepository } from "../repository/note.repository";
import { WorkspaceRepository } from "../repository/workspace.repository";
import { DatabaseService } from "./database.service";
import { WorkspaceService } from "./workspace.service";
import { DocumentService } from "./document.service";
import { Rank } from "@/common/rank";

export class NoteService {
  constructor(
    private noteRepository: NoteRepository = new NoteRepository(),
    private databaseRepository: DatabaseRepository = new DatabaseRepository(),
    private workspaceRepository: WorkspaceRepository = new WorkspaceRepository(),
    private workspaceService: WorkspaceService = new WorkspaceService(),
    private databaseService: DatabaseService = new DatabaseService(),
    private documentService: DocumentService = new DocumentService()
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
    if(orderHint) note.orderHint = orderHint;
    else {
      const lastHint = (await this.noteRepository.findLastNoteInOrder(workspace.id))?.orderHint;
      if(!lastHint) note.orderHint = Rank.default().toString();
      else note.orderHint = new Rank(lastHint).next().toString();
    }
    note.favoriteOrderHint = favoriteOrderHint;
    note.database = database;
    note.createdAt = new Date();
    note.modifiedAt = new Date();
    note.icon = icon;
    note.parentId = parentId;
    note.isFavorite = false;
    note.isTrashed = false;

    const saved = await this.noteRepository.save(note);
    await this.documentService.setNoteContent(saved.id, "{}");
    return saved;
  }

  async getAllByWorkspaceId(workspaceId: string) {
    console.log("a");
    console.log(await this.noteRepository.findLastNoteInOrder(workspaceId));
    return this.noteRepository.findAllByWorkspaceId(workspaceId);
  }

  async update(id: string, dto: UpdateNoteDTO) {
    const {workspaceId, databaseId, ...rest} = dto;
    //@ts-expect-error delete to prevent accidental assignment
    delete rest.workspace;
    //@ts-expect-error delete to prevent accidental assignment
    delete rest.database;
    let workspace: Workspace | undefined = undefined;
    let database: Database | undefined = undefined;
    if(workspaceId) workspace = await this.workspaceService.findWorkspaceOrThrow(workspaceId);
    if(databaseId) database = await this.databaseService.findDatabaseOrThrow(databaseId);
    // reassign order key on restore
    const note = await this.noteRepository.findById(id);
    if(!note) throw new Error(`Note ${id} does not exist.`);
    Object.assign(note, rest);
    if(dto.isTrashed === true) note.isFavorite = false;
    if(dto.isTrashed === false) {
      const lastNote = await this.noteRepository.findLastNoteInOrder(note.workspace.id);
      const nextRank = lastNote ? new Rank(lastNote.orderHint).next() : Rank.default();
      note.orderHint = nextRank.get();
    }
    if(dto.isFavorite === true && !dto.favoriteOrderHint) {
      const lastInFavorites = await this.noteRepository.findLastNoteInFavorites(note.workspace.id);
      const nextRank = lastInFavorites ? new Rank(lastInFavorites.orderHint).next() : Rank.default();
      console.log("favorite rank will be", nextRank)
      note.favoriteOrderHint = nextRank.get();
    }
    console.log(rest);
    if(workspace) note.workspace = workspace;
    if(database) note.database = database;
    if("databaseId" in dto && dto.databaseId === undefined) note.database = undefined;
    
    return await this.noteRepository.save(note);
  }

  async deleteById(id: string) {
    this.noteRepository.deleteById(id);
    this.documentService.deleteNoteContent(id); 
  }

  async getById(id: string) {
    return await this.noteRepository.findById(id);
  }

}
