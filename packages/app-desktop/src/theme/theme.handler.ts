import type { IThemeAPI } from "@darkwrite/common";
import { BrowserWindow, dialog, shell } from "electron";
import { err, ok, type Result, ResultAsync } from "neverthrow";
import { Paths } from "@/lib/paths";
import { type HandlerImplements, handler } from "@/types";
import type { IThemeService } from "./theme.service";

const _cancelledError = { type: "_internal-cancelled-action" as const };
type CancelledErr = typeof _cancelledError;

function pickThemeFile(): Result<string, CancelledErr> {
  const path = dialog.showOpenDialogSync(BrowserWindow.getAllWindows()[0], {
    filters: [{ name: "Darkwrite theme", extensions: ["json"] }],
    properties: ["dontAddToRecent", "openFile"],
  });
  if (!path) return err(_cancelledError);
  return ok(path[0]);
}

export function ThemeAPI(
  themeService: IThemeService,
): HandlerImplements<IThemeAPI> {
  const importTheme = handler(() =>
    pickThemeFile()
      .asyncAndThen(themeService.importTheme)
      .orElse((e) =>
        e === _cancelledError
          ? ok()
          : err(e as Exclude<typeof e, CancelledErr>),
      ),
  );

  const getThemes = handler(() =>
    themeService.getThemes().map((themes) => ({ themes })),
  );

  const openThemeFolder = handler(() =>
    ResultAsync.fromSafePromise(shell.openPath(Paths.THEME_DIR)).map(() => {}),
  );

  return {
    importTheme,
    getThemes,
    openThemeFolder,
  };
}
