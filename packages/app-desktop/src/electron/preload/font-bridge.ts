import { contextBridge, ipcRenderer } from 'electron';

export interface FontAPI {
  getSystemFonts: () => Promise<string[]>;
}

contextBridge.exposeInMainWorld('fontAPI', {
  getSystemFonts: () => ipcRenderer.invoke('get-system-fonts'),
} as FontAPI); 