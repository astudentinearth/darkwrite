import { EventBus } from "@/common/event/bus";
import { Content, Editor } from "@tiptap/core";
import { EditorEventType, EditorEvent } from "./types";
import EditorUtil from "../editor-util";

export type EditorEvents = {
  [id: string]: EditorEvent;
};

export const EditorEventBus = new EventBus<EditorEvents>();

export function handleEditorEvent(editor: Editor, event: EditorEvent) {
  const util = EditorUtil(editor);
  switch (event.type) {
    case EditorEventType.FOCUS:
      editor.chain().focus().run();
      break;

    case EditorEventType.INSERT_CONTENT:
      const position = event.payload.position ?? util.getEndPos();
      editor.chain().insertContentAt(position, event.payload.content).run();
      break;
  }
}

export function emitEditorEvent(event: EditorEvent) {
  EditorEventBus.emit(event.noteId, event);
}
