import { ContextMenuApiBridge } from "@/desktop-integration/context-menu.handler";
import { ShellApiBridge } from "@/desktop-integration/shell.handler";
import {
  buildDwError,
  DarkwriteDesktopClientInfo,
  DwResultAsync,
  Font,
  IDesktopAPI,
  OS,
  stripAlpha,
} from "@darkwrite/common";
import { app, systemPreferences } from "electron";
import { ok, ResultAsync } from "neverthrow";
import os from "os";
import { handler, HandlerImplements } from "../types";

const operatingSystem = os.platform() as OS;

function getSystemAccentColor() {
  // TODO: Linux integration will be provided over D-Bus hopefully,
  // unless Electron implements Linux support themselves.
  if (operatingSystem == OS.LINUX) return ok("0000ff");
  const color = systemPreferences.getAccentColor();
  return ok(stripAlpha(color));
}

function getAvailableFonts(): DwResultAsync<Font[]> {
  async function _getFonts() {
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

  return ResultAsync.fromPromise(_getFonts(), (err) =>
    buildDwError("Failed to retrieve system font list.", String(err)),
  );
}

function getClientInfo(): DarkwriteDesktopClientInfo {
  return {
    electronVersion: process.versions.electron,
    isPackaged: app.isPackaged,
    nodeVersion: process.versions.node,
    os: os.platform() as OS,
    version: app.getVersion(),
  };
}

export const DesktopApiBridge: HandlerImplements<IDesktopAPI> = {
  getClientInfo: handler(() => ok(getClientInfo())),
  getFontList: handler(getAvailableFonts),
  getSystemAccentColor: handler(getSystemAccentColor),
  contextMenu: ContextMenuApiBridge,
  shell: ShellApiBridge,
};
