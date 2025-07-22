import { DatabaseService } from "./service/database.service";
import { DocumentService } from "./service/document.service";
import { EmbedService } from "./service/embed.service";
import { NoteService } from "./service/note.service";
import { ThemeService } from "./service/theme.service";
import { WorkspaceService } from "./service/workspace.service";

export class ServiceContainer {
  static noteService: NoteService = new NoteService();
  static workspaceService: WorkspaceService = new WorkspaceService();
  static databaseService: DatabaseService = new DatabaseService();
  static embedService: EmbedService = new EmbedService();
  static documentService: DocumentService = new DocumentService();
  static themeService: ThemeService = new ThemeService();
}