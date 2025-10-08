import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from "electron";

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
      { role: "forceReload" },
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
    label: "View",
    submenu: [
      {
        label: "Reset zoom",
        id: "resetzoom",
        click(menuItem, browserWindow) {
          if (browserWindow instanceof BrowserWindow) browserWindow.webContents.setZoomFactor(1.0);
        }
      },

      {
        label: "Zoom in",
        id: "resetzoom",
        click(menuItem, browserWindow) {
          if (browserWindow instanceof BrowserWindow) browserWindow.webContents.setZoomFactor(browserWindow.webContents.getZoomFactor() + 0.1);
        }
      },

      {
        label: "Zoom out",
        id: "resetzoom",
        click(menuItem, browserWindow) {
          if (browserWindow instanceof BrowserWindow) {
            const level = browserWindow.webContents.getZoomFactor() - 0.1
            browserWindow.webContents.setZoomFactor(
              level < 0 ? 0.1 : level
            );
          }
        }
      }
    ]
  }
];

export function initAppMenu() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export function showAppMenu() {
  Menu.getApplicationMenu()?.popup();
}
