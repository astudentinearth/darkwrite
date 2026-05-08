import { EventBus } from "@darkwrite/common";

export enum AppMenuBusEvent {
  CREATE_NOTE = "create-note",
}

export type AppMenuBusEventMap = {
  [AppMenuBusEvent.CREATE_NOTE]: undefined;
};

export const AppMenuBus = new EventBus<AppMenuBusEventMap>();

export function setupAppMenuEvents() {
  if (window.events) {
    window.events.menu.onCreateNote(() => {
      AppMenuBus.emit(AppMenuBusEvent.CREATE_NOTE, undefined);
    });
  }
}
