import type { DarkwriteUserSettings } from "@/lib/models";
import { is } from "@electron-toolkit/utils";
import { type BrowserWindowConstructorOptions } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function constructWindow(
  prefs: DarkwriteUserSettings,
): BrowserWindowConstructorOptions {
  let titleBarStyle: "default" | "hidden" = "default";
  if (
    (process.platform === "win32" || process.platform === "linux") &&
    !prefs.appearance.useSystemWindowFrame
  ) {
    titleBarStyle = "hidden";
  }
  if (
    prefs.appearance.experimental.darwinCustomTitlebarEnabled &&
    process.platform === "darwin" &&
    !prefs.appearance.useSystemWindowFrame
  )
    titleBarStyle = "hidden";
  return {
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
    },
    icon: is.dev ? join(__dirname, "../resources/icon_dev.png") : undefined,
    titleBarStyle,
    titleBarOverlay:
      titleBarStyle == "hidden"
        ? {
            color: "#13131300",
            symbolColor: "#ffffff",
            height: 48,
          }
        : false,
    autoHideMenuBar: true,
    // TODO: Persist window size
    width: 1000,
    height: 700,
  };
}
