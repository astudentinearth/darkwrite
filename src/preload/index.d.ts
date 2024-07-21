import { NoteMetada } from '@common/note'
import { UserSettings } from '@common/settings'
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
        setTrashStatus: (id: string, state: boolean)=>Promise<void>,
        getNote: (id:string)=>Promise<NoteMetada | null>
      },
      settings: {
        load: ()=>Promise<UserSettings | null>,
        save: (data: UserSettings)=>Promise<void>
      }
    }
  }
}
