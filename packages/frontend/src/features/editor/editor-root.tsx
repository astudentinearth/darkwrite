import { Tiptap, useEditor } from "@tiptap/react";
import { use } from "react";
import { DarkwriteEditorContext } from "./context";
import useEditorBuilder from "./hooks/use-editor-builder";
import { EditorContent, TextDirection } from "./types";

export function EditorRoot(props: { content: EditorContent }) {
  const context = use(DarkwriteEditorContext);
  const { extensions, children } = useEditorBuilder();
  const editor = useEditor({
    extensions,
    content: props.content,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getJSON();
      context.onContentChange(updatedContent);
      context.onUpdate?.(editor);
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
