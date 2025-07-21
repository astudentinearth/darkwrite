// This file contains the common interfaces for frontend API clients.
// Electron-side handlers should implement these directly and expose it via the API bridge.
// Clients talking to a cloud instance shall make the appropriate network requests instead.
// Cloud-specific code should be kept separate from Electron to ensure browser portability.
import { CreateNoteDTO, NoteResponseDTO, NotesResponseDTO, UpdateNoteDTO } from "./dto";
import { CreateEmbedDTO } from "./dto/request/embed.request";
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "./dto/request/workspace.request";
import { EmbedResponseDTO } from "./dto/response/embed.response";
import { WorkspaceResponseDTO, WorkspacesResponseDTO } from "./dto/response/workspace.response";
import { DarkwriteUserSettings } from "./settings";

export interface INoteAPI {
  create: (dto: CreateNoteDTO) => Promise<NoteResponseDTO>;
  update: (id: string, dto: UpdateNoteDTO) => Promise<NoteResponseDTO>;
  delete: (id: string) => Promise<void>;
  getAllByWorkspaceId: (workspaceId: string) => Promise<NotesResponseDTO>;
  getById: (id: string) => Promise<NoteResponseDTO>;
}

export interface IWorkspaceAPI {
  create: (dto: CreateWorkspaceDTO) => Promise<WorkspaceResponseDTO>;
  update: (id: string, dto: UpdateWorkspaceDTO) => Promise<WorkspaceResponseDTO>;
  getAll: () => Promise<WorkspacesResponseDTO>;
  delete: (id: string) => Promise<void>;
}

export interface IEmbedAPI {
  // HTTP clients should build a multipart request using this DTO for compatibility
  create: (dto: CreateEmbedDTO) => Promise<EmbedResponseDTO>;
  getById: (id: string) => Promise<EmbedResponseDTO>;
}

export interface ISettingsAPI {
  getUserSettings: () => Promise<DarkwriteUserSettings>;
  saveUserSettings: (settings: DarkwriteUserSettings) => Promise<void>;
}
