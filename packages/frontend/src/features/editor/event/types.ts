import { Content } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";

export enum EditorEventType {
  FOCUS = "focus",
  INSERT_CONTENT = "insert-content",
  HISTORY = "history",
}

export type EditorContentType = "md" | "json" | "html";

// insert content

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
}

// focus

export interface FocusEvent {
  noteId: string;
  type: EditorEventType.FOCUS;
}

// history

export interface HistoryEvent {
  noteId: string;
  type: EditorEventType.HISTORY;
  payload: "undo" | "redo";
}

export type EditorEvent = FocusEvent | InsertContentEvent | HistoryEvent;
