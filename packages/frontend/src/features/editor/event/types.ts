import { Content, JSONContent } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";

export enum EditorEventType {
  FOCUS = "focus",
  INSERT_CONTENT = "insert-content",
  HISTORY = "history",
  SYNC_CONTENT = "sync-content",
}

export type EditorContentType = "md" | "json" | "html";

export type InsertContentPayload = (
  | {
      content: Node | Content | Fragment;
      type?: "json";
    }
  | { type: "md" | "html"; content: string }
) & { position?: number };

export interface InsertContentEvent {
  noteId: string;
  type: EditorEventType.INSERT_CONTENT;
  payload: InsertContentPayload;
  targetInstanceId?: string;
}

export interface FocusEvent {
  noteId: string;
  type: EditorEventType.FOCUS;
  targetInstanceId?: string;
}

export interface HistoryEvent {
  noteId: string;
  type: EditorEventType.HISTORY;
  payload: "undo" | "redo";
  targetInstanceId?: string;
}

// sync-content

export interface SyncContentEvent {
  noteId: string;
  type: EditorEventType.SYNC_CONTENT;
  content: JSONContent;
  instanceId: string;
}

export type EditorEvent =
  | FocusEvent
  | InsertContentEvent
  | HistoryEvent
  | SyncContentEvent;
