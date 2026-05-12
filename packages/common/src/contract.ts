// This file contains the common interfaces for frontend API clients.
// Electron-side handlers should implement these directly and expose it via the API bridge.
// Clients talking to a cloud instance shall make the appropriate network requests instead.
// Cloud-specific code should be kept separate from Electron to ensure browser portability.
import { ResultAsync } from "neverthrow";
import { DarkwriteDesktopClientInfo, UpdateServerResponse } from "./client";
import { NativeContextMenuData } from "./context-menu";
import {
  CreateNoteDTO,
  MoveNoteDTO,
  NoteContentResponseDTO,
  NoteResponseDTO,
  NotesResponseDTO,
  ParentTreeResponseDTO,
  UpdateNoteDTO,
} from "./dto";
import { CreateEmbedDTO } from "./dto/request/embed.request";
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
} from "./dto/request/workspace.request";
import { EmbedDTO, EmbedResponseDTO } from "./dto/response/embed.response";
import { ThemesResponseDTO } from "./dto/response/theme.response";
import {
  WorkspaceResponseDTO,
  WorkspacesResponseDTO,
} from "./dto/response/workspace.response";
import { Font } from "./font";
import { FileLinkMetadata } from "./link";
import { NoteExportFormat, NoteImportResult, ParentId } from "./note";
import { PageSize } from "./pdf";
import { DarkwriteUserSettings } from "./settings";
import { BackupError, FileLinkError, InternalError, ThemeError } from "./error";

export type ApiResult<T, E> = ResultAsync<T, E | InternalError>;
export type VoidR = ResultAsync<void, never>;

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
   *
   * @param noteId
   * @returns the parent tree of the note in sorted order.
   */
  getParentTree: (noteId: string) => Promise<ParentTreeResponseDTO>;

  moveToTrash: (noteId: string) => Promise<NoteResponseDTO>;
  restoreFromTrash: (noteId: string) => Promise<NoteResponseDTO>;

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
  clearTrash: (workspaceId: string) => Promise<void>;
  /** @returns the file path of the exported PDF, or undefined if the export was cancelled. */
  export: (
    fileContent: string,
    fileType: NoteExportFormat,
    title?: string,
  ) => Promise<string | undefined>;
  /** @returns the file path of the exported PDF, or undefined if the export was cancelled. */
  exportPdf: (
    html: string,
    title?: string,
    pageSize?: PageSize,
  ) => Promise<string | undefined>;
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
  download: (id: string) => Promise<void>;
}

export interface ISettingsAPI {
  getUserSettings: () => ApiResult<DarkwriteUserSettings, never>;
  saveUserSettings: (settings: DarkwriteUserSettings) => VoidR;
}

export interface IThemeAPI {
  getThemes: () => ApiResult<ThemesResponseDTO, ThemeError>;
  importTheme: () => ApiResult<void, ThemeError>;
}

/** APIs for triggering native context menu actions. These are only relevant in the Electron environment, but defining them here allows us to keep the frontend code that interacts with it platform-agnostic. In the browser, these should not be implemented, and the browser's own context menu should be used. */
export interface IContextMenuAPI {
  copy: () => VoidR;
  cut: () => VoidR;
  paste: () => VoidR;
  /** May be referred as "paste and match style" in some platforms. */
  pasteWithoutFormatting: () => VoidR;
  selectAll: () => VoidR;
  delete: () => VoidR;
  changeSpelling: (suggestion: string) => VoidR;
}

export interface IShellAPI {
  showItemInFolder: (filePath: string) => VoidR;
}

export interface IDesktopAPI {
  getFontList: () => ApiResult<Font[], never>;
  getSystemAccentColor: () => ApiResult<string, never>;
  getClientInfo: () => ApiResult<DarkwriteDesktopClientInfo, never>;
  contextMenu: IContextMenuAPI;
  shell: IShellAPI;
}

export interface IBackupAPI {
  performBackup: () => ApiResult<void, BackupError>;
  pushFile: (filename: string, content: string) => ApiResult<void, BackupError>;
  finishExport: () => ApiResult<void, BackupError>;
  chooseArchive: () => ResultAsync<string | null, never>;
  restoreBackup: (archivePath: string) => ApiResult<void, BackupError>;
  initCache: () => VoidR;
}

export type CheckUpdateFn = () => Promise<UpdateServerResponse | undefined>;

export interface IOnboardingAPI {
  isNewUser: () => ApiResult<boolean, never>;
  markFinished: () => ApiResult<void, never>;
}

export interface IFileLinkAPI {
  /** Opens a file picker, creates a linked file record, and returns its metadata. Returns null if the dialog was cancelled. */
  pickAndCreate: () => ApiResult<FileLinkMetadata | null, FileLinkError>;
  /** Creates a linked file record from the given absolute file path. */
  createFromPath: (
    filePath: string,
  ) => ApiResult<FileLinkMetadata, FileLinkError>;
  getById: (id: string) => ApiResult<FileLinkMetadata, FileLinkError>;
  /** Opens the linked file in the OS default application. */
  openById: (id: string) => VoidR;
}

/** Desktop specific bridge. This is decorated with IEmbedAPI on the frontend */
export interface DesktopEmbedAPI {
  createFromLocalFile: (
    filePath: string,
    workspaceId: string,
  ) => Promise<{ embed: EmbedDTO }>;
  createFromArrayBuffer: (
    buffer: ArrayBuffer,
    filetype: string,
    workspaceId: string,
  ) => Promise<{ embed: EmbedDTO }>;
  getById: (id: string) => Promise<EmbedResponseDTO>;
  getEncoded: (ids: string[]) => Promise<Record<string, string>>;
  download: (id: string) => Promise<void>;
}

export type DarkwriteIPCBridge = {
  note: INoteAPI;
  workspace: IWorkspaceAPI;
  embed: DesktopEmbedAPI;
  settings: ISettingsAPI;
  theme: IThemeAPI;
  desktop: IDesktopAPI;
  backup: IBackupAPI;
  onboarding: IOnboardingAPI;
  fileLink: IFileLinkAPI;
  checkUpdate: CheckUpdateFn;
  showAppMenu: () => Promise<void>;
};

export interface WindowEvents {
  onEnterFullScreen: (callback: () => void) => void;
  onExitFullScreen: (callback: () => void) => void;
  onContextMenu: (callback: (data: NativeContextMenuData) => void) => void;
  menu: {
    onCreateNote: (callback: () => void) => void;
  };
}
