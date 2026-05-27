import { handler, type HandlerImplements } from "@/types";
import type { IContextMenuAPI } from "@darkwrite/common";
import type { IpcMainInvokeEvent } from "electron";
import { ok } from "neverthrow";

export const ContextMenuHandler = {
  copy({ sender }: IpcMainInvokeEvent) {
    sender.copy();
    return ok();
  },
  cut({ sender }: IpcMainInvokeEvent) {
    sender.cut();
    return ok();
  },
  paste({ sender }: IpcMainInvokeEvent) {
    sender.paste();
    return ok();
  },
  pasteWithoutFormatting({ sender }: IpcMainInvokeEvent) {
    sender.pasteAndMatchStyle();
    return ok();
  },
  selectAll({ sender }: IpcMainInvokeEvent) {
    sender.selectAll();
    return ok();
  },
  delete({ sender }: IpcMainInvokeEvent) {
    sender.delete();
    return ok();
  },
  changeSpelling({ sender }: IpcMainInvokeEvent, suggestion: string) {
    sender.replaceMisspelling(suggestion);
    return ok();
  },
};

export const ContextMenuApiBridge: HandlerImplements<IContextMenuAPI> = {
  copy: handler(ContextMenuHandler.copy, true),
  cut: handler(ContextMenuHandler.cut, true),
  paste: handler(ContextMenuHandler.paste, true),
  pasteWithoutFormatting: handler(
    ContextMenuHandler.pasteWithoutFormatting,
    true,
  ),
  selectAll: handler(ContextMenuHandler.selectAll, true),
  delete: handler(ContextMenuHandler.delete, true),
  changeSpelling: handler(ContextMenuHandler.changeSpelling, true),
};
