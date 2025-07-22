import { stripAlpha } from "@/common/theme";
import { BrowserWindow, nativeTheme, systemPreferences } from "electron";
import _ from "lodash";
import os from "os";
import { ThemeMode } from "../types";
import { OS } from "./os";

export class DesktopIntegration {
  static operatingSystem: OS;
  static {
    this.operatingSystem = os.platform() as OS;
  }

  static getSystemAccentColor() {
    // TODO: Linux integration will be provided over D-Bus hopefully,
    // unless Electron implements Linux support themselves.
    if (this.operatingSystem == OS.LINUX) return "0000ff";
    const color = systemPreferences.getAccentColor();
    return stripAlpha(color);
  }

  static setThemeMode = (themeMode: ThemeMode) =>
    (nativeTheme.themeSource = themeMode);

  static setTitlebarSymbolColor(symbolColor: string) {
    BrowserWindow.getAllWindows().forEach((w) => {
      _.attempt(() => w.setTitleBarOverlay({ symbolColor }));
    });
  }
}
