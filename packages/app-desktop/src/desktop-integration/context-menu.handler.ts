import { IPCHandler } from "@/types";
import { IpcMainInvokeEvent } from "electron";

export const ContextMenuHandler = {
  async copy({ sender }: IpcMainInvokeEvent) {
    sender.copy();
  },
  async cut({ sender }: IpcMainInvokeEvent) {
    sender.cut();
  },
  async paste({ sender }: IpcMainInvokeEvent) {
    sender.paste();
  },
  async pasteWithoutFormatting({ sender }: IpcMainInvokeEvent) {
    sender.pasteAndMatchStyle();
  },
  async selectAll({ sender }: IpcMainInvokeEvent) {
    sender.selectAll();
  },
  async delete({ sender }: IpcMainInvokeEvent) {
    sender.delete();
  },
  async changeSpelling({ sender }: IpcMainInvokeEvent, suggestion: string) {
    sender.replaceMisspelling(suggestion);
  },
};

export const ContextMenuApiBridge = {
  copy: new IPCHandler(true, ContextMenuHandler.copy),
  cut: new IPCHandler(true, ContextMenuHandler.cut),
  paste: new IPCHandler(true, ContextMenuHandler.paste),
  pasteWithoutFormatting: new IPCHandler(
    true,
    ContextMenuHandler.pasteWithoutFormatting,
  ),
  selectAll: new IPCHandler(true, ContextMenuHandler.selectAll),
  delete: new IPCHandler(true, ContextMenuHandler.delete),
  changeSpelling: new IPCHandler(true, ContextMenuHandler.changeSpelling),
};
