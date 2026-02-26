import { Content } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";

export enum EditorEventType {
  FOCUS = "focus",
  INSERT_CONTENT = "insert-content",
}

// insert content

export interface InsertContentPayload {
  position?: number;
  content: Node | Content | Fragment;
}

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
