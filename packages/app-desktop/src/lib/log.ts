import log from "electron-log";
export function logError(error: unknown, fallbackMessage = "Unknown error.") {
  if (error instanceof Error) log.error(error.message, error.stack);
  log.error(fallbackMessage);
}
