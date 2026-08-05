import { Tiptap, useEditor } from "@tiptap/react";
import { use, useEffect } from "react";
import { useAppSelector } from "@/features/store/hooks";
import { DarkwriteEditorContext } from "./context";
import { emitEditorEvent } from "./event/editor-bus";
import { EditorEventType } from "./event/types";
import useEditorBuilder from "./hooks/use-editor-builder";
import { EditorContext } from "./store/editor-context";
import { selectEditorEditable } from "./store/editor-selectors";
import { type EditorContent, TextDirection } from "./types";

export function EditorRoot(props: { content: EditorContent }) {
  const context = use(DarkwriteEditorContext);
  const { instanceId } = use(EditorContext);
  const { extensions, children } = useEditorBuilder();
  const editable = useAppSelector(selectEditorEditable);
  const editor = useEditor({
    extensions,
    editable,
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

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      // emitUpdate: false so toggling doesn't fire onUpdate (which would emit a
      // SYNC_CONTENT event and trigger autosave for a no-op change).
      editor.setEditable(editable, false);
    }
  }, [editor, editable]);

  return (
    <Tiptap editor={editor}>
      <Tiptap.Content />
      {children}
    </Tiptap>
  );
}
