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
import { EmbedResponseDTO } from "./dto/response/embed.response";
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
import { DwError } from "./result";

export type ApiResult<T> = ResultAsync<T, DwError>;
export type NoReturn = ResultAsync<void, never>;

export interface INoteAPI {
  create: (dto: CreateNoteDTO) => ApiResult<NoteResponseDTO>;
  update: (id: string, dto: UpdateNoteDTO) => ApiResult<NoteResponseDTO>;
  move: (dto: MoveNoteDTO) => ApiResult<NoteResponseDTO>;

  /**
   * **PERMANENTLY** deletes a note. This is **NOT** the same as moving to trash. If you
   * want to move a note to the trash can, do an update request with `isTrashed`.
   * @remarks This action is irreversible.
   * @param id
   * @returns
   */
  delete: (id: string) => ApiResult<void>;

  /**
   * @deprecated This API is way too broad and should be avoided in favor of more specific queries. This can be removed in future releases.
   * @param workspaceId
   * @returns
   */
  getAllByWorkspaceId: (workspaceId: string) => ApiResult<NotesResponseDTO>;

  /**
   * @param workspaceId
   * @param parentId
   * @returns notes that belong to the given parent (folder) in the specified workspace and that are NOT trashed.
   */
  getByParentId: (
    workspaceId: string,
    parentId: ParentId,
  ) => ApiResult<NotesResponseDTO>;

  /**
   * @param workspaceId
   * @param parentId
   * @returns favorites in the given workspace, provided they are not trashed.
   */
  getFavorites: (workspaceId: string) => ApiResult<NotesResponseDTO>;

  /**
   * Returns notes that are in the trash for the given workspace.
   * @param workspaceId
   */
  getTrashed: (workspaceId: string) => ApiResult<NotesResponseDTO>;

  /**
   *
   * @param noteId
   * @returns the parent tree of the note in sorted order.
   */
  getParentTree: (noteId: string) => ApiResult<ParentTreeResponseDTO>;

  moveToTrash: (noteId: string) => ApiResult<NoteResponseDTO>;
  restoreFromTrash: (noteId: string) => ApiResult<NoteResponseDTO>;

  /**
   * Favorites a note.
   * @param noteId
   * @param aboveNoteId undefined for list end, null for list start
   * @returns
   */
  favorite: (
    noteId: string,
    aboveNoteId?: string | null,
  ) => ApiResult<NoteResponseDTO>;

  unfavorite: (noteId: string) => ApiResult<NoteResponseDTO>;

  search: (workspaceId: string, query: string) => ApiResult<NotesResponseDTO>;
  getRecents: (workspaceId: string) => ApiResult<NotesResponseDTO>;

  getById: (id: string) => ApiResult<NoteResponseDTO>;
  getDocument: (id: string) => ApiResult<NoteContentResponseDTO>;
  setDocument: (id: string, serializedDocument: string) => ApiResult<void>;
  duplicate: (id: string) => ApiResult<NoteResponseDTO>;
  clearTrash: (workspaceId: string) => ApiResult<void>;
  /** @returns the file path of the exported PDF, or undefined if the export was cancelled. */
  export: (
    fileContent: string,
    fileType: NoteExportFormat,
    title?: string,
  ) => ApiResult<string | undefined>;
  /** @returns the file path of the exported PDF, or undefined if the export was cancelled. */
  exportPdf: (
    html: string,
    title?: string,
    pageSize?: PageSize,
  ) => ApiResult<string | undefined>;
  import: () => ApiResult<NoteImportResult>;
}

export interface IWorkspaceAPI {
  create: (dto: CreateWorkspaceDTO) => ApiResult<WorkspaceResponseDTO>;
  update: (
    id: string,
    dto: UpdateWorkspaceDTO,
  ) => ApiResult<WorkspaceResponseDTO>;
  getAll: () => ApiResult<WorkspacesResponseDTO>;
  delete: (id: string) => ApiResult<void>;
}

export interface IEmbedAPI {
  // HTTP clients should build a multipart request using this DTO for compatibility
  create: (dto: CreateEmbedDTO) => ApiResult<EmbedResponseDTO>;
  getById: (id: string) => ApiResult<EmbedResponseDTO>;
  getEncoded: (ids: string[]) => ApiResult<Record<string, string>>;
  download: (id: string) => ApiResult<void>;
}

export interface ISettingsAPI {
  getUserSettings: () => ApiResult<DarkwriteUserSettings>;
  saveUserSettings: (settings: DarkwriteUserSettings) => NoReturn;
}

export interface IThemeAPI {
  getThemes: () => ApiResult<ThemesResponseDTO>;
  importTheme: () => ApiResult<void>;
}

/** APIs for triggering native context menu actions. These are only relevant in the Electron environment, but defining them here allows us to keep the frontend code that interacts with it platform-agnostic. In the browser, these should not be implemented, and the browser's own context menu should be used. */
export interface IContextMenuAPI {
  copy: () => NoReturn;
  cut: () => NoReturn;
  paste: () => NoReturn;
  /** May be referred as "paste and match style" in some platforms. */
  pasteWithoutFormatting: () => NoReturn;
  selectAll: () => NoReturn;
  delete: () => NoReturn;
  changeSpelling: (suggestion: string) => NoReturn;
}

export interface IShellAPI {
  showItemInFolder: (filePath: string) => NoReturn;
}

export interface IDesktopAPI {
  getFontList: () => ApiResult<Font[]>;
  getSystemAccentColor: () => ApiResult<string>;
  getClientInfo: () => ApiResult<DarkwriteDesktopClientInfo>;
  contextMenu: IContextMenuAPI;
  shell: IShellAPI;
}

export interface IBackupAPI {
  performBackup: () => ApiResult<void>;
  pushFile: (filename: string, content: string) => ApiResult<void>;
  finishExport: () => ApiResult<void>;
  chooseArchive: () => ResultAsync<string | null, never>;
  restoreBackup: (archivePath: string) => ApiResult<void>;
  initCache: () => NoReturn;
}

export type CheckUpdateFn = () => Promise<UpdateServerResponse | undefined>;

export interface IOnboardingAPI {
  isNewUser: () => ApiResult<boolean>;
  markFinished: () => ApiResult<void>;
}

export interface IFileLinkAPI {
  /** Opens a file picker, creates a linked file record, and returns its metadata. Returns null if the dialog was cancelled. */
  pickAndCreate: () => ApiResult<FileLinkMetadata | null>;
  /** Creates a linked file record from the given absolute file path. */
  createFromPath: (filePath: string) => ApiResult<FileLinkMetadata>;
  getById: (id: string) => ApiResult<FileLinkMetadata>;
  /** Opens the linked file in the OS default application. */
  openById: (id: string) => NoReturn;
}

/** Desktop specific bridge. This is decorated with IEmbedAPI on the frontend */
export interface DesktopEmbedAPI {
  createFromLocalFile: (
    filePath: string,
    workspaceId: string,
  ) => ApiResult<EmbedResponseDTO>;
  createFromArrayBuffer: (
    buffer: ArrayBuffer,
    filetype: string,
    workspaceId: string,
  ) => ApiResult<EmbedResponseDTO>;
  getById: (id: string) => ApiResult<EmbedResponseDTO>;
  getEncoded: (ids: string[]) => ApiResult<Record<string, string>>;
  download: (id: string) => NoReturn;
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
