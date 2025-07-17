import type { DarkwriteUserSettings } from "@/lib/settings";
import { is } from "@electron-toolkit/utils";
import { type BrowserWindowConstructorOptions } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import metadata from "./metadata.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getTitlebarStyle(prefs: DarkwriteUserSettings) {
  if (
    metadata.windowDefaults.wcoEnabledPlatforms.includes(process.platform) &&
    !prefs.appearance.useSystemWindowFrame
  ) {
    return "hidden";
  }
  if (
    prefs.appearance.experimental.darwinCustomTitlebarEnabled &&
    process.platform === "darwin" &&
    !prefs.appearance.useSystemWindowFrame
  ) return "hidden";
  return "default";
}

export function constructWindow(
  prefs: DarkwriteUserSettings,
): BrowserWindowConstructorOptions {
  const titleBarStyle: "default" | "hidden" = getTitlebarStyle(prefs);
  return {
    webPreferences: {
      preload: join(__dirname, metadata.preloadScriptPath),
      devTools: true,
    },
    icon: is.dev ? join(__dirname, metadata.icons.development) : undefined,
    titleBarStyle,
    titleBarOverlay:
      titleBarStyle == "hidden"
        ? metadata.windowDefaults.titleBarOverlay
        : false,
    autoHideMenuBar: true,
    // TODO: Persist window size
    width: metadata.windowDefaults.width,
    height: metadata.windowDefaults.height,
  };
}
