import {
  app,
  BrowserWindow,
  type MenuItemConstructorOptions as ElectronMenuItem,
  Menu,
  shell,
} from "electron";
import meta from "@/metadata.json";
import { isWayland } from "./desktop-integration/linux";
import { t } from "./i18n";
import { AppMenuEvent } from "./types/window-events";

const HistoryAccelerators = {
  back: process.platform === "darwin" ? "Cmd+[" : "Alt+Left",
  forward: process.platform === "darwin" ? "Cmd+]" : "Alt+Right",
};

function buildTemplate(): ElectronMenuItem[] {
  // carry the checkbox state over when the menu is rebuilt
  const alwaysOnTop =
    Menu.getApplicationMenu()?.getMenuItemById("alwaysontop")?.checked ?? false;

  const template: Array<ElectronMenuItem> = [
    {
      role: "fileMenu",
      submenu: [
        {
          type: "normal",
          label: t("menu.newNote"),
          click(_menuItem, window) {
            if (window instanceof BrowserWindow) {
              window.webContents.send(AppMenuEvent.CREATE_NEW_NOTE);
            }
          },
          accelerator: "CmdOrCtrl+N",
        },
        { role: "close" },
      ],
    },
    { role: "editMenu" },
    {
      label: t("menu.tools"),
      submenu: [
        {
          label: t("menu.alwaysOnTop"),
          id: "alwaysontop",
          click(menuItem, browserWindow) {
            browserWindow?.setAlwaysOnTop(!browserWindow.isAlwaysOnTop());
            if (browserWindow) menuItem.checked = browserWindow.isAlwaysOnTop();
          },
          checked: alwaysOnTop,
          type: "checkbox",
          enabled: !isWayland,
        },
        {
          label: t("menu.openDataDirectory"),
          id: "opendatadirectory",
          click() {
            shell.openPath(app.getPath("userData"));
          },
        },
      ],
    },
    {
      role: "viewMenu",
    },
    {
      label: t("menu.history"),
      submenu: [
        {
          label: t("menu.back"),
          click(_menuItem, window) {
            if (window instanceof BrowserWindow)
              window.webContents.navigationHistory.goBack();
          },
          accelerator: HistoryAccelerators.back,
        },
        {
          label: t("menu.forward"),
          click(_menuItem, window) {
            if (window instanceof BrowserWindow)
              window.webContents.navigationHistory.goForward();
          },
          accelerator: HistoryAccelerators.forward,
        },
      ],
    },
    { role: "windowMenu" },
    {
      role: "help",
      submenu: [
        {
          label: t("menu.help.website"),
          click: () => shell.openExternal(meta.websiteUrl),
        },
        {
          label: t("menu.help.reportBugs"),
          click: () => shell.openExternal(meta.reportBugsUrl),
        },
        {
          label: t("menu.help.documentation"),
          click: () => shell.openExternal(meta.documentationUrl),
        },
      ],
    },
  ];

  if (process.platform === "darwin") {
    template.unshift({
      role: "appMenu",
      label: app.name,
    });
  }

  return template;
}

export function initAppMenu() {
  const menu = Menu.buildFromTemplate(buildTemplate());
  Menu.setApplicationMenu(menu);
}

export function showAppMenu() {
  Menu.getApplicationMenu()?.popup();
}
