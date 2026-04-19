import { EventBus, NativeContextMenuData } from "@darkwrite/common";

export type ContextMenuEventMap = {
  onShow: NativeContextMenuData;
};

export const ContextMenuEventBus = new EventBus<ContextMenuEventMap>();

if (window.events) {
  window.events.onContextMenu((data) => {
    ContextMenuEventBus.emit("onShow", data);
  });
}
