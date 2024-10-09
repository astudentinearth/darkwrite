import { ipcMain, Menu, MenuItemConstructorOptions } from "electron";

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
    ],
  },
];

export function initAppMenu() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

ipcMain.handle("show-app-menu", () => {
  Menu.getApplicationMenu()?.popup();
});
