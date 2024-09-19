/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Note, NoteExportType } from '@darkwrite/common'
import { UserSettings } from '@darkwrite/common'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  showAppMenu: ()=>ipcRenderer.invoke("show-app-menu"),
  note:{
    create: (title: string, parent?: string)=>ipcRenderer.invoke("create-note", title, parent),
    setContents: (id: string, content: string)=>ipcRenderer.invoke("set-note-contents", id, content),
    getContents: (id: string)=>ipcRenderer.invoke("get-note-contents", id),
    delete: (id: string)=>ipcRenderer.invoke("delete-note", id),
    move: (sourceID: string, destID: (string | undefined))=>ipcRenderer.invoke("move-note", sourceID, destID),
    update: (note: Partial<Note>)=>ipcRenderer.invoke("update-note", note),
    getAll: ()=>ipcRenderer.invoke("get-all-notes"),
    setTrashStatus: (id: string, state: boolean)=>ipcRenderer.invoke("set-trash-status", id ,state),
    getNote: (id:string)=>ipcRenderer.invoke("get-note", id),
    saveAll: (notes: Note[])=>ipcRenderer.invoke("save-notes", notes),
    export: (title: string, content: string, exportType: NoteExportType)=>ipcRenderer.invoke("export-note", title, content, exportType)
  },
  settings: {
    load: ()=>ipcRenderer.invoke("load-user-settings"),
    save: (data: UserSettings)=>ipcRenderer.invoke("save-user-settings", data)
  }
})