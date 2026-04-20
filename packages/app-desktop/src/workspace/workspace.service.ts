import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "@darkwrite/common";
import { getDefaultWorkspaceConfiguration } from "@darkwrite/common";
import { WorkspaceDAO } from "./workspace.dao";
import { Workspace } from "@/db/schema";
import { DatabaseType, db as defaultDb } from "@/db";
import { NoteDAO } from "@/note/note.dao";
import { DocumentService } from "@/service/document.service";
import log from "electron-log";

export class WorkspaceService {
  private workspaceDAO: WorkspaceDAO;
  private noteDAO: NoteDAO;
  private documentService: DocumentService;
  constructor(
    private db: DatabaseType = defaultDb,
    workspaceDAO?: WorkspaceDAO,
    noteDAO?: NoteDAO,
    documentService?: DocumentService,
  ) {
    this.workspaceDAO = workspaceDAO ?? new WorkspaceDAO(this.db);
    this.noteDAO = noteDAO ?? new NoteDAO(this.db);
    this.documentService = documentService ?? new DocumentService();
  }

  async createWorkspace(dto: CreateWorkspaceDTO): Promise<Workspace> {
    const { config, name, iconUrl } = dto;
    return await this.workspaceDAO.create({
      createdAt: new Date(),
      name,
      iconUrl,
      config,
    });
  }

  /** Initializes a default workspace if no workspaces exist. Returns true if a workspace already exists, or the newly created workspace if not.
   * This method is idempotent, and calling it again is harmless. */
  async initializeDefaultWorkspace() {
    const workspaces = await this.workspaceDAO.findAll();
    if (workspaces.length > 0) return true;
    else
      return this.createWorkspace({
        name: "My Workspace",
        config: getDefaultWorkspaceConfiguration(),
      });
  }

  async findWorkspaceOrThrow(id: string): Promise<Workspace> {
    return await this.workspaceDAO.findByIdOrThrow(id);
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return await this.workspaceDAO.findAll();
  }

  async update(id: string, dto: UpdateWorkspaceDTO) {
    return await this.workspaceDAO.update({ id, ...dto });
  }

  /** Deletes the workspace and all associated notes.
   * @throws `NotFoundError` if the workspace does not exist. */
  async delete(workspaceId: string) {
    const targetNotes = await this.db.transaction(async (tx) => {
      const noteTx = this.noteDAO.transactional(tx);
      const workspaceTx = this.workspaceDAO.transactional(tx);

      const workspace = await workspaceTx.findByIdOrThrow(workspaceId);
      const notes = await noteTx.findAllByWorkspaceId(workspaceId);

      await workspaceTx.delete(workspace);
      return notes;
    });

    // clean up after transaction
    try {
      await Promise.all(
        targetNotes.map((n) => this.documentService.deleteNoteContent(n.id)),
      );
    } catch (error) {
      log.error(
        "Failed to delete note contents from disk after workspace deletion. The notes have been removed from the database, but their contents may still exist on disk. Error:",
        error,
      );
    }
  }
}
