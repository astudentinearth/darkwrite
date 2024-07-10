/* eslint-disable @typescript-eslint/ban-ts-comment */
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  showAppMenu: ()=>ipcRenderer.invoke("show-app-menu"),
  somevar: 2
})