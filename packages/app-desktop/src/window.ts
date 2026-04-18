import { is } from "@electron-toolkit/utils";
import { type BrowserWindowConstructorOptions } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import metadata from "./metadata.json";
import {
  DarkwriteUserSettings,
  NativeContextMenuData,
} from "@darkwrite/common";
import { WindowEvent } from "./types/window-events";

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
  backgroundColor: string = "#000",
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
    backgroundColor,
  };
}

export function setupWindowEvents(window: Electron.BrowserWindow) {
  window.on("enter-full-screen", () => {
    window.webContents.send(WindowEvent.ENTER_FULLSCREEN);
  });

  window.on("leave-full-screen", () => {
    window.webContents.send(WindowEvent.EXIT_FULLSCREEN);
  });

  window.webContents.on("context-menu", (_event, params) => {
    const data: NativeContextMenuData = {
      editable: params.isEditable,
      editActions: {
        cut: params.editFlags.canCut,
        copy: params.editFlags.canCopy,
        paste: params.editFlags.canPaste,
        pasteWithoutFormatting: params.editFlags.canPaste,
        selectAll: params.editFlags.canSelectAll,
        delete: params.editFlags.canDelete,
      },
      x: params.x,
      y: params.y,
      spellingSuggestions: params.dictionarySuggestions,
    };

    window.webContents.send(WindowEvent.CONTEXT_MENU, data);
  });
}
