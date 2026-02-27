import { Content } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";

export enum EditorEventType {
  FOCUS = "focus",
  INSERT_CONTENT = "insert-content",
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

export type EditorEvent = FocusEvent | InsertContentEvent;
