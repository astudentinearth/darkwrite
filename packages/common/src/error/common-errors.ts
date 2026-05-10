import { ClientError } from "./client-error";

export type EntityType =
  | "Note"
  | "Workspace"
  | "Embed"
  | "Database"
  | "FileLink";

/** @deprected use neverthrow instead */
export function _buildNotFoundMessage(entityName: string, entityId: string) {
  return `${entityName} with id ${entityId} not found.`;
}

/** @deprected use neverthrow instead */
export class NotFoundError extends ClientError {
  constructor(
    public readonly entityType: EntityType,
    public readonly entityId: string,
  ) {
    super(_buildNotFoundMessage(entityType, entityId));
  }
}

/** @deprected use neverthrow instead */
export class IllegalArgumentError extends ClientError {
  constructor(public readonly message: string) {
    super(message);
  }
}

/** @deprected use neverthrow instead */
export class InvalidThemeError extends ClientError {
  constructor(public readonly themeId: string) {
    super(`Invalid theme: ${themeId}`);
  }
}

/** @deprected use neverthrow instead */
export class InvalidSettingsError extends ClientError {
  constructor(public readonly message: string = "Invalid settings file.") {
    super(message);
  }
}

/** @deprected use neverthrow instead */
export class InvalidBackupError extends ClientError {
  constructor(
    public readonly message: string = "This does not seem to be a Darkwrite backup archive.",
  ) {
    super(message);
  }
}

/** @deprected use neverthrow instead */
export class MutationError extends ClientError {
  constructor(public readonly message: string) {
    super(message);
  }
}

// everything above is deprecated

export type NoteError =
  | { type: "note-not-found"; id: string }
  | { type: "note-failed-to-create"; cause?: unknown }
  | { type: "note-failed-to-update"; cause?: unknown }
  | {
      type: "note-failed-to-move";
      cause?: "trashed" | "cannot-move-below-null" | "circular-reference";
    }
  | { type: "note-failed-to-delete"; cause?: unknown }
  | { type: "cannot-favorite-in-trash" };

export type NoteErrorType = NoteError["type"];

export type WorkspaceError =
  | { type: "workspace-not-found"; id: string }
  | { type: "workspace-failed-to-create"; cause?: unknown }
  | { type: "workspace-failed-to-delete"; cause?: unknown };

export type WorkspaceErrorType = WorkspaceError["type"];

export type EmbedError = { type: "embed-not-found"; id: string };

export type FileLinkError =
  | { type: "file-link-not-found"; id: string }
  | { type: "file-link-target-missing"; id: string };

export type DatabaseError = { type: "database-not-found"; id: string };

export type ThemeError =
  | { type: "invalid-theme" }
  | { type: "theme-not-found"; id: string };

// filesystem errors, database errors etc. should get narrowed down to this before its sent to the frontend
export type InternalError = { type: "internal-error"; message: string };
