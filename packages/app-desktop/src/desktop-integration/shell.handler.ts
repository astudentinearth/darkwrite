import { handler, type HandlerImplements } from "@/types";
import type { IShellAPI } from "@darkwrite/common";
import { shell } from "electron";
import { ok } from "neverthrow";

export const ShellHandler = {
  showItemInFolder: (path: string) => {
    shell.showItemInFolder(path);
    return ok();
  },
};

export const ShellApiBridge: HandlerImplements<IShellAPI> = {
  showItemInFolder: handler(ShellHandler.showItemInFolder),
};
