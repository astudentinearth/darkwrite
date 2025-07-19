import { DatabaseService } from "./service/database.service";
import { NoteService } from "./service/note.service";
import { WorkspaceService } from "./service/workspace.service";

export class ServiceContainer {
  static noteService: NoteService = new NoteService();
  static workspaceService: WorkspaceService = new WorkspaceService();
  static databaseService: DatabaseService = new DatabaseService();
}