import { Note, NoteExportType } from "@darkwrite/common";
import { UserSettings } from "@darkwrite/common";
import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      showAppMenu: () => void;
      note: {
        create: (title: string, parent?: string) => Promise<Note | null>;
        setContents: (id: string, content: string) => Promise<void>;
        getContents: (id: string) => Promise<string>;
        delete: (id: string) => Promise<void>;
        move: (sourceID: string, destID: string | undefined) => Promise<void>;
        update: (note: Partial<Note>) => Promise<void>;
        getAll: () => Promise<Note[]>;
        setTrashStatus: (id: string, state: boolean) => Promise<void>;
        getNote: (id: string) => Promise<Note | null>;
        saveAll: (notes: Note[]) => Promise<void>;
        export: (
          title: string,
          content: string,
          exportType: NoteExportType,
        ) => Promise<void>;
        importHTML: () => Promise<string>;
      };
      settings: {
        load: () => Promise<UserSettings | null>;
        save: (data: UserSettings) => Promise<void>;
      };
    };
  }
}
