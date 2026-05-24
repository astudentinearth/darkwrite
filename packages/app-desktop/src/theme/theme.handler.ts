import { handler, HandlerImplements } from "@/types";
import { IThemeAPI } from "@darkwrite/common";
import { BrowserWindow, dialog } from "electron";
import { err, ok, Result } from "neverthrow";
import { IThemeService } from "./theme.service";

const _cancelledError = { type: "_internal-cancelled-action" as const };
type CancelledErr = typeof _cancelledError;

function pickThemeFile(): Result<string, CancelledErr> {
  const path = dialog.showOpenDialogSync(BrowserWindow.getAllWindows()[0], {
    filters: [{ name: "Darkwrite theme", extensions: ["json"] }],
    properties: ["dontAddToRecent"],
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

  return {
    importTheme,
    getThemes,
  };
}
