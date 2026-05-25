import { EventBus } from "@darkwrite/common";
import { Editor } from "@tiptap/core";
import { EditorEventType, EditorEvent } from "./types";
import EditorUtil from "../editor-util";

export type EditorEvents = {
  [id: string]: EditorEvent;
};

export const EditorEventBus = new EventBus<EditorEvents>();

export function handleEditorEvent(editor: Editor, event: EditorEvent) {
  const util = EditorUtil(editor);
  switch (event.type) {
    case EditorEventType.FOCUS: {
      editor.chain().focus().run();
      break;
    }

    case EditorEventType.INSERT_CONTENT: {
      const position = event.payload.position ?? util.getEndPos();

      // extract method and use switch/case if extension needed
      if (event.payload.type === "html") util.insertHTML(event.payload.content);
      else if (event.payload.type === "md")
        util.insertMarkdown(event.payload.content);
      else
        editor.chain().insertContentAt(position, event.payload.content).run();

      break;
    }

    case EditorEventType.HISTORY: {
      if (event.payload === "undo") editor.chain().undo().run();
      else if (event.payload === "redo") editor.chain().redo().run();
      break;
    }

    case EditorEventType.SYNC_CONTENT: {
      editor.commands.setContent(event.content, { emitUpdate: false });
      break;
    }
  }
}

export function emitEditorEvent(event: EditorEvent) {
  EditorEventBus.emit(event.noteId, event);
}
