import { ClientError } from "./client-error";

export type EntityType = "Note" | "Workspace" | "Embed" | "Database";

export function _buildNotFoundMessage(entityName: string, entityId: string) {
  return `${entityName} with id ${entityId} not found.`;
}

export class NotFoundError extends ClientError {
  constructor(
    public readonly entityType: EntityType,
    public readonly entityId: string,
  ) {
    super(_buildNotFoundMessage(entityType, entityId));
  }
}

export class IllegalArgumentError extends ClientError {
  constructor(public readonly message: string) {
    super(message);
  }
}

export class InvalidThemeError extends ClientError {
  constructor(public readonly themeId: string) {
    super(`Invalid theme: ${themeId}`);
  }
}

export class InvalidSettingsError extends ClientError {
  constructor(public readonly message: string = "Invalid settings file.") {
    super(message);
  }
}

export class InvalidBackupError extends ClientError {
  constructor(
    public readonly message: string = "This does not seem to be a Darkwrite backup archive.",
  ) {
    super(message);
  }
}

export class MutationError extends ClientError {
  constructor(public readonly message: string) {
    super(message);
  }
}
