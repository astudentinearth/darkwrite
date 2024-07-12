import { NoteMetada } from '@common/note'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI,
    api: {
      showAppMenu: ()=>void,
      note:{
        create: (title: string, parent?: string)=>Promise<void>,
        setContents: (id: string, content: string)=>Promise<void>,
        getContents: (id: string)=>Promise<string>,
        delete: (id: string)=>Promise<void>,
        move: (sourceID: string, destID: (string | undefined))=>Promise<void>,
        update: (note: NoteMetada)=>Promise<void>,
        getAll: ()=>Promise<NoteMetada[]>,
        setTrashStatus: ()=>Promise<void>
      }
    }
  }
}
