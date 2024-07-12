/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NoteMetada } from '@common/note'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  showAppMenu: ()=>ipcRenderer.invoke("show-app-menu"),
  note:{
    create: (title: string, parent?: string)=>ipcRenderer.invoke("create-note", title, parent),
    setContents: (id: string, content: string)=>ipcRenderer.invoke("set-note-contents", id, content),
    getContents: (id: string)=>ipcRenderer.invoke("get-note-contents", id),
    delete: (id: string)=>ipcRenderer.invoke("delete-note", id),
    move: (sourceID: string, destID: (string | undefined))=>ipcRenderer.invoke("move-note", sourceID, destID),
    update: (note: NoteMetada)=>ipcRenderer.invoke("update-note", note),
    getAll: ()=>ipcRenderer.invoke("get-all-notes"),
    setTrashStatus: (id: string, state: boolean)=>ipcRenderer.invoke("set-trash-status", id ,state)
  }
})