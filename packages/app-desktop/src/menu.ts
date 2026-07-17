import {
  app,
  BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
  shell,
} from "electron";
import { t } from "./i18n";
import { AppMenuEvent } from "./types/window-events";
import meta from "@/metadata.json";

const HistoryAccelerators = {
  back: process.platform === "darwin" ? "Cmd+[" : "Alt+Left",
  forward: process.platform === "darwin" ? "Cmd+]" : "Alt+Right",
};

function buildTemplate(): MenuItemConstructorOptions[] {
  // carry the checkbox state over when the menu is rebuilt
  const alwaysOnTop =
    Menu.getApplicationMenu()?.getMenuItemById("alwaysontop")?.checked ?? false;

  const template: Array<MenuItemConstructorOptions> = [
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
