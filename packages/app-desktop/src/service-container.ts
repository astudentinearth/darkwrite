import { DatabaseService } from "./service/database.service";
import { DocumentService } from "./service/document.service";
import { EmbedService } from "./service/embed.service";
import { ThemeService } from "./service/theme.service";
import { WorkspaceService } from "./workspace/workspace.service";

/** @deprecated */
export class ServiceContainer {
  static workspaceService: WorkspaceService;
  static databaseService: DatabaseService;
  static embedService: EmbedService;
  static documentService: DocumentService;
  static themeService: ThemeService;

  static init() {
    ServiceContainer.databaseService = new DatabaseService();
    ServiceContainer.workspaceService = new WorkspaceService();
    ServiceContainer.embedService = new EmbedService();
    ServiceContainer.documentService = new DocumentService();
    ServiceContainer.themeService = new ThemeService();
  }
}
