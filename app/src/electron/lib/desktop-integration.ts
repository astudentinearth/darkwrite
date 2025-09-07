import { stripAlpha } from "@/common/theme";
import { BrowserWindow, nativeTheme, systemPreferences } from "electron";
import _ from "lodash";
import os from "os";
import { ThemeMode } from "../types";
import { OS } from "./os";
import {getFonts2} from "font-list"
import { Font } from "@/common/font";

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

  static async getAvailableFonts(): Promise<Font[]> {
    const fonts = await getFonts2();
    const list = fonts.map(f => ({family: f.familyName, monospace: f.monospace} satisfies Font));
    const families = new Set<string>();
    const filtered = list.filter((obj) => {
      if(families.has(obj.family)) return false;
      families.add(obj.family);
      return true;
    });
    return filtered;
  }
}
