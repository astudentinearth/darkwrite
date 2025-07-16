import { app, Menu, MenuItemConstructorOptions, shell } from "electron";

const template: Array<MenuItemConstructorOptions> = [
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
      { role: "toggleDevTools" },
      { role: "reload" },
      {
        label: "Open data directory",
        id: "opendatadirectory",
        click() {
          shell.openPath(app.getPath("userData"));
        },
      },
    ],
  },
];

export function initAppMenu() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export function showAppMenu() {
  Menu.getApplicationMenu()?.popup();
}
