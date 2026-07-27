import { Tiptap, useEditor } from "@tiptap/react";
import { use } from "react";
import { DarkwriteEditorContext } from "./context";
import { emitEditorEvent } from "./event/editor-bus";
import { EditorEventType } from "./event/types";
import useEditorBuilder from "./hooks/use-editor-builder";
import { EditorContext } from "./store/editor-context";
import { type EditorContent, TextDirection } from "./types";

export function EditorRoot(props: { content: EditorContent }) {
  const context = use(DarkwriteEditorContext);
  const { instanceId } = use(EditorContext);
  const { extensions, children } = useEditorBuilder();
  const editor = useEditor({
    extensions,
    content: props.content,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getJSON();
      context.onContentChange(updatedContent);
      context.onUpdate?.(editor);
      emitEditorEvent({
        noteId: context.noteId,
        type: EditorEventType.SYNC_CONTENT,
        content: updatedContent,
        instanceId,
      });
    },
    onCreate: ({ editor }) => {
      context.onCreate?.(editor);
    },
    textDirection: TextDirection.Auto,
    editorProps: {
      attributes: {
        class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-hidden text-(--dw-editor-foreground) max-w-(--editor-max-width)`,
      },
    },
  });
  return (
    <Tiptap editor={editor}>
      <Tiptap.Content />
      {children}
    </Tiptap>
  );
}
