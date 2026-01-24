import { EventBus } from "@/common/event/bus";

export enum NavigationEventType {
  NOTE = "note",
}

export interface NavigationEvent {
  type: NavigationEventType;
}

export interface NoteNavigationEvent extends NavigationEvent {
  noteId: string | null;
}

export type NavigationEvents = {
  note: NoteNavigationEvent;
  onRouteChanged: string;
};

export const NavigationEventBus = new EventBus<NavigationEvents>();

export function navigateToNote(noteId: string) {
  NavigationEventBus.emit("onRouteChanged", `/page/${noteId}`);
  NavigationEventBus.emit("note", { type: NavigationEventType.NOTE, noteId });
}

export function getCurrentRoutePath() {
  return window.location.hash.slice(1).split("?")[0];
}

export function navigateHome() {
  NavigationEventBus.emit("onRouteChanged", `/`);
  NavigationEventBus.emit("note", {
    type: NavigationEventType.NOTE,
    noteId: null,
  });
}
