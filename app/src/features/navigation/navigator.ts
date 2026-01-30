import { EventBus } from "@/common/event/bus";
import { matchPath } from "react-router-dom";

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

export function getCurrentNoteIdFromPath(): string | null {
  const path = getCurrentRoutePath();
  const match = matchPath("/page/:pageId", path);
  if (match?.params.pageId) {
    return match.params.pageId;
  }
  return null;
}

export function navigateHome() {
  NavigationEventBus.emit("onRouteChanged", `/`);
  notifyNoteChange(null);
}

export function goBack() {
  window.history.back();
}

export function goForward() {
  window.history.forward();
}

function notifyNoteChange(noteId: string | null) {
  NavigationEventBus.emit("note", { type: NavigationEventType.NOTE, noteId });
}

window.addEventListener("popstate", () => {
  const noteId = getCurrentNoteIdFromPath();
  notifyNoteChange(noteId);
});
