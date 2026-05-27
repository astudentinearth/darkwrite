import { EventBus, type NativeContextMenuData } from "@darkwrite/common";

export type ContextMenuEventMap = {
  onShow: NativeContextMenuData;
};

export const ContextMenuEventBus = new EventBus<ContextMenuEventMap>();

export function setupContextMenuEvents() {
  if (window.events) {
    window.events.onContextMenu((data) => {
      ContextMenuEventBus.emit("onShow", data);
    });
  }
}
