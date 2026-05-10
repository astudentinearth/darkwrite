import { BrowserWindow, dialog } from "electron";
import { IThemeService } from "./theme.service";
import { err, ok, Result } from "neverthrow";
import { FsError } from "@/lib/fs";
import { InternalError, JsonParseError, ThemeError } from "@darkwrite/common";
import { DocumentStoreErr } from "@/lib/document-store";

type CancelledErr = { type: "_internal-cancelled-action" };

function pickThemeFile(): Result<string, CancelledErr> {
  const path = dialog.showOpenDialogSync(BrowserWindow.getAllWindows()[0], {
    filters: [{ name: "Darkwrite theme", extensions: ["json"] }],
    properties: ["dontAddToRecent"],
  });
  if (!path) return err({ type: "_internal-cancelled-action" });
  return ok(path[0]);
}

function mapThemeErrors(
  err: FsError | JsonParseError | ThemeError | DocumentStoreErr,
): ThemeError | InternalError {
  switch (err.type) {
    case "fs-error":
    case "path-error":
      return { type: "internal-error", message: "File system error." };

    case "document-not-found":
      return { type: "theme-not-found", id: err.id };

    case "invalid-json-string":
      return { type: "invalid-theme" };

    case "theme-not-found":
    case "invalid-theme":
      return err;
  }
}

export function ThemeAPI(themeService: IThemeService) {
  const importTheme = () =>
    pickThemeFile()
      .asyncAndThen(themeService.importTheme)
      .orElse((e) => (e.type === "_internal-cancelled-action" ? ok() : err(e)))
      .mapErr(mapThemeErrors);

  const getThemes = () => themeService.getThemes().mapErr(mapThemeErrors);

  return {
    importTheme,
    getThemes,
  };
}
