import { IPCHandler } from "@/types";
import { shell } from "electron";

export const ShellHandler = {
  showItemInFolder: async (path: string) => {
    shell.showItemInFolder(path);
  },
};

export const ShellApiBridge = {
  showItemInFolder: new IPCHandler(false, ShellHandler.showItemInFolder),
};
