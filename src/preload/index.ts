/* eslint-disable @typescript-eslint/ban-ts-comment */
import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  
})