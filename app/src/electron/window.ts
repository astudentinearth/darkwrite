import { is } from "@electron-toolkit/utils";
import { type BrowserWindowConstructorOptions } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import metadata from "./metadata.json";
import { DarkwriteUserSettings } from "@/common/settings";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getTitlebarStyle(prefs: DarkwriteUserSettings) {
  if (prefs.appearance.useSystemWindowFrame) {
    return "default";
  } else {
    if (process.platform === "darwin") return "hiddenInset";
    return "hidden";
  }
}

export function constructWindow(
  prefs: DarkwriteUserSettings,
): BrowserWindowConstructorOptions {
  const titleBarStyle = getTitlebarStyle(prefs);
  return {
    webPreferences: {
      preload: join(__dirname, metadata.preloadScriptPath),
      devTools: true,
    },
    icon: is.dev ? join(__dirname, metadata.icons.development) : undefined,
    titleBarStyle,
    trafficLightPosition: {
      x: 15,
      y: 15,
    },
    ...(process.platform != "darwin"
      ? {
          titleBarOverlay:
            titleBarStyle == "hidden"
              ? metadata.windowDefaults.titleBarOverlay
              : undefined,
        }
      : {}),
    autoHideMenuBar: true,
    // TODO: Persist window size
    width: metadata.windowDefaults.width,
    height: metadata.windowDefaults.height,
  };
}
