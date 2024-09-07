import "reflect-metadata"
import { app, BrowserWindow, shell } from 'electron'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import {is} from '@electron-toolkit/utils'
import icon from "../../resources/icon256.png?asset";
import { readUserPrefs } from './api/settings';
import log from "electron-log/main.js"
import {initAppMenu} from "./menu"
import { AppDataSource } from './db';
import "./ipc"


log.initialize();
const require = createRequire(import.meta.url)


let win: BrowserWindow | null

function createWindow() {
  const prefs = readUserPrefs();
  log.debug("creating main window")
  win = new BrowserWindow({
    icon,
    webPreferences: {
        preload: join(__dirname, '../preload/index.cjs'),
    },
    titleBarStyle: process.platform === "win32" ? "hidden" : "default", //TODO: Implement experimental support for macOS later
    titleBarOverlay: process.platform === "win32" ? {
      color: "#131313",
      symbolColor: "#ffffff",
      height: 48
    } : false,
  })
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  win.webContents.setWindowOpenHandler(({url})=>{
    shell.openExternal(url);
    return {'action': "deny"}
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
  initAppMenu();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(()=>{
  AppDataSource.initialize().then(createWindow);
})
