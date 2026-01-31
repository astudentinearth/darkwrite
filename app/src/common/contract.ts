// This file contains the common interfaces for frontend API clients.
// Electron-side handlers should implement these directly and expose it via the API bridge.
// Clients talking to a cloud instance shall make the appropriate network requests instead.
// Cloud-specific code should be kept separate from Electron to ensure browser portability.
import { DarkwriteDesktopClientInfo } from "./client";
import {
  CreateNoteDTO,
  MoveNoteDTO,
  NoteContentResponseDTO,
  NoteResponseDTO,
  NotesResponseDTO,
  UpdateNoteDTO,
} from "./dto";
import { CreateEmbedDTO } from "./dto/request/embed.request";
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
} from "./dto/request/workspace.request";
import { EmbedResponseDTO } from "./dto/response/embed.response";
import { ThemesResponseDTO } from "./dto/response/theme.response";
import {
  WorkspaceResponseDTO,
  WorkspacesResponseDTO,
} from "./dto/response/workspace.response";
import { Font } from "./font";
import { NoteExportFormat, NoteImportResult, ParentId } from "./note";
import { PageSize } from "./pdf";
import { DarkwriteUserSettings } from "./settings";

export interface INoteAPI {
  create: (dto: CreateNoteDTO) => Promise<NoteResponseDTO>;
  update: (id: string, dto: UpdateNoteDTO) => Promise<NoteResponseDTO>;
  move: (dto: MoveNoteDTO) => Promise<NoteResponseDTO>;

  /**
   * **PERMANENTLY** deletes a note. This is **NOT** the same as moving to trash. If you
   * want to move a note to the trash can, do an update request with `isTrashed`.
   * @remarks This action is irreversible.
   * @param id
   * @returns
   */
  delete: (id: string) => Promise<void>;

  /**
   * @deprecated This API is way too broad and should be avoided in favor of more specific queries. This can be removed in future releases.
   * @param workspaceId
   * @returns
   */
  getAllByWorkspaceId: (workspaceId: string) => Promise<NotesResponseDTO>;

  /**
   * @param workspaceId
   * @param parentId
   * @returns notes that belong to the given parent (folder) in the specified workspace and that are NOT trashed.
   */
  getByParentId: (
    workspaceId: string,
    parentId: ParentId,
  ) => Promise<NotesResponseDTO>;

  /**
   * @param workspaceId
   * @param parentId
   * @returns favorites in the given workspace, provided they are not trashed.
   */
  getFavorites: (workspaceId: string) => Promise<NotesResponseDTO>;

  /**
   * Returns notes that are in the trash for the given workspace.
   * @param workspaceId
   */
  getTrashed: (workspaceId: string) => Promise<NotesResponseDTO>;

  /**
   * Favorites a note.
   * @param noteId
   * @param aboveNoteId undefined for list end, null for list start
   * @returns
   */
  favorite: (
    noteId: string,
    aboveNoteId?: string | null,
  ) => Promise<NoteResponseDTO>;

  unfavorite: (noteId: string) => Promise<NoteResponseDTO>;

  search: (workspaceId: string, query: string) => Promise<NotesResponseDTO>;
  getRecents: (workspaceId: string) => Promise<NotesResponseDTO>;

  getById: (id: string) => Promise<NoteResponseDTO>;
  getDocument: (id: string) => Promise<NoteContentResponseDTO>;
  setDocument: (id: string, serializedDocument: string) => Promise<void>;
  duplicate: (id: string) => Promise<NoteResponseDTO>;
  export: (
    fileContent: string,
    fileType: NoteExportFormat,
    title?: string,
  ) => Promise<void>;
  exportPdf: (
    html: string,
    title?: string,
    pageSize?: PageSize,
  ) => Promise<void>;
  import: () => Promise<NoteImportResult>;
}

export interface IWorkspaceAPI {
  create: (dto: CreateWorkspaceDTO) => Promise<WorkspaceResponseDTO>;
  update: (
    id: string,
    dto: UpdateWorkspaceDTO,
  ) => Promise<WorkspaceResponseDTO>;
  getAll: () => Promise<WorkspacesResponseDTO>;
  delete: (id: string) => Promise<void>;
}

export interface IEmbedAPI {
  // HTTP clients should build a multipart request using this DTO for compatibility
  create: (dto: CreateEmbedDTO) => Promise<EmbedResponseDTO>;
  getById: (id: string) => Promise<EmbedResponseDTO>;
  getEncoded: (ids: string[]) => Promise<Record<string, string>>;
}

export interface ISettingsAPI {
  getUserSettings: () => Promise<DarkwriteUserSettings>;
  saveUserSettings: (settings: DarkwriteUserSettings) => Promise<void>;
}

export interface IThemeAPI {
  getThemes: () => Promise<ThemesResponseDTO>;
  importTheme: () => Promise<void>;
}

export interface IDesktopAPI {
  getFontList: () => Promise<Font[]>;
  getSystemAccentColor: () => Promise<string>;
  getClientInfo: () => Promise<DarkwriteDesktopClientInfo>;
}
