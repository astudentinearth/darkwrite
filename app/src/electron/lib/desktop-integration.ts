import { stripAlpha } from "@/common/theme";
import { app, BrowserWindow, nativeTheme, systemPreferences } from "electron";
import _ from "lodash";
import os from "os";
import { ThemeMode } from "../types";
import { OS } from "../../common/os";
import { Font } from "@/common/font";
import { DarkwriteDesktopClientInfo } from "@/common/client";

export class DesktopIntegration {
  static get operatingSystem() {
    return os.platform() as OS;
  }

  static getSystemAccentColor() {
    // TODO: Linux integration will be provided over D-Bus hopefully,
    // unless Electron implements Linux support themselves.
    if (DesktopIntegration.operatingSystem == OS.LINUX) return "0000ff";
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

  static async getAvailableFonts(): Promise<Font[]> {
    // FIXME: The font-list package implodes on macOS
    // due to some CJS issue. We'll fall back to text
    // fields on macOS until we figure out how to call
    // CoreText directly.
    if (os.platform() == "darwin") return [];
    const { getFonts2 } = await import("font-list");
    const fonts = await getFonts2();
    const list = fonts.map(
      (f) => ({ family: f.familyName, monospace: f.monospace }) satisfies Font,
    );
    const families = new Set<string>();
    const filtered = list.filter((obj) => {
      if (families.has(obj.family)) return false;
      families.add(obj.family);
      return true;
    });
    return filtered;
  }

  static async getClientInfo(): Promise<DarkwriteDesktopClientInfo> {
    return {
      electronVersion: process.versions.electron,
      isPackaged: app.isPackaged,
      nodeVersion: process.versions.node,
      os: os.platform() as OS,
      version: app.getVersion(),
    };
  }
}
