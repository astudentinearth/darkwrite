import type { ResultAsync } from "neverthrow";
import type {
  DarkwriteDesktopClientInfo,
  UpdateServerResponse,
} from "./client";
import type { NativeContextMenuData } from "./context-menu";
import type { UpdateNoteDTO } from "./dto";
import type { CreateEmbedDTO } from "./dto/request/embed.request";
import type {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
} from "./dto/request/workspace.request";
import type { ThemesResponseDTO } from "./dto/response/theme.response";
import type { EmbedResponseDTO } from "./embed";
import type { Font } from "./font";
import type { FileLinkMetadata } from "./link";
import type {
  Note,
  NoteContentResponseDTO,
  NoteExportFormat,
  NoteImportResult,
  NotePartial,
  NoteResponseDTO,
  NotesResponseDTO,
} from "./note";
import type { PageSize } from "./pdf";
import type { DwError, DwResultAsync } from "./result";
import type { DarkwriteUserSettings } from "./settings";
import type { WorkspaceResponseDTO, WorkspacesResponseDTO } from "./workspace";

export type ApiResult<T> = ResultAsync<T, DwError>;
export type NoReturn = ResultAsync<void, never>;

export interface INoteAPI {
  /**
   * Save a newly created note.
   */
  create: (note: Note) => ApiResult<void>;
  update: (id: string, dto: UpdateNoteDTO) => ApiResult<NoteResponseDTO>;
  patchAll: (notes: NotePartial[]) => ApiResult<void>;

  /**
   * **PERMANENTLY** deletes a note. This is **NOT** the same as moving to trash. If you
   * want to move a note to the trash can, do an update request with `isTrashed`.
   * @remarks This action is irreversible.
   * @param id
   * @returns
   */
  delete: (id: string) => ApiResult<void>;

  /**
   * @param workspaceId
   * @returns all notes in a workspace.
   */
  getAllByWorkspaceId: (workspaceId: string) => ApiResult<NotesResponseDTO>;

  moveToTrash: (noteId: string) => ApiResult<NoteResponseDTO>;
  restoreFromTrash: (noteId: string) => ApiResult<NoteResponseDTO>;

  search: (workspaceId: string, query: string) => ApiResult<NotesResponseDTO>;

  getById: (id: string) => ApiResult<NoteResponseDTO>;
  getDocument: (id: string) => ApiResult<NoteContentResponseDTO>;
  setDocument: (id: string, serializedDocument: string) => ApiResult<void>;
  /** @deprecated */
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

export type CheckUpdateFn = () => DwResultAsync<
  UpdateServerResponse | undefined
>;

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
  getAll: () => ApiResult<FileLinkMetadata[]>;
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
  showAppMenu: () => NoReturn;
};

export interface WindowEvents {
  onEnterFullScreen: (callback: () => void) => void;
  onExitFullScreen: (callback: () => void) => void;
  onContextMenu: (callback: (data: NativeContextMenuData) => void) => void;
  /** Fired whenever a file link is created in any window, so every
   * window can keep its in-memory file link list in sync. */
  onFileLinkCreated: (callback: (link: FileLinkMetadata) => void) => void;
  menu: {
    onCreateNote: (callback: () => void) => void;
  };
}
