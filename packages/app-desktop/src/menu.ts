import {
  app,
  BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
  shell,
} from "electron";
import { AppMenuEvent } from "./types/window-events";

const HistoryAccelerators = {
  back: process.platform === "darwin" ? "Cmd+[" : "Alt+Left",
  forward: process.platform === "darwin" ? "Cmd+]" : "Alt+Right",
};

const template: Array<MenuItemConstructorOptions> = [
  {
    role: "fileMenu",
    submenu: [
      {
        type: "normal",
        label: "New Note",
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
    label: "Tools",
    submenu: [
      {
        label: "Always on top",
        id: "alwaysontop",
        click(menuItem, browserWindow) {
          browserWindow?.setAlwaysOnTop(!browserWindow.isAlwaysOnTop());
          if (browserWindow) menuItem.checked = browserWindow.isAlwaysOnTop();
        },
        checked: false,
        type: "checkbox",
      },
      {
        label: "Open data directory",
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
    label: "History",
    submenu: [
      {
        label: "Back",
        click(_menuItem, window) {
          if (window instanceof BrowserWindow)
            window.webContents.navigationHistory.goBack();
        },
        accelerator: HistoryAccelerators.back,
      },
      {
        label: "Forward",
        click(_menuItem, window) {
          if (window instanceof BrowserWindow)
            window.webContents.navigationHistory.goForward();
        },
        accelerator: HistoryAccelerators.forward,
      },
    ],
  },
  { role: "windowMenu" },
];

if (process.platform === "darwin") {
  template.unshift({
    role: "appMenu",
    label: app.name,
  });
}

export function initAppMenu() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export function showAppMenu() {
  Menu.getApplicationMenu()?.popup();
}
