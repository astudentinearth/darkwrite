import { EditorProvider } from "@tiptap/react";
import { use } from "react";
import { DarkwriteEditorContext } from "./context";
import { Padder } from "./extensions/padder";
import { EditorContent } from "./types";
import useEditorBuilder from "./hooks/use-editor-builder";

export function EditorRoot(props: { content: EditorContent }) {
  const context = use(DarkwriteEditorContext);
  const { extensions, children } = useEditorBuilder();
  return (
    <EditorProvider
      content={props.content}
      onUpdate={({ editor }) => {
        const updatedContent = editor.getJSON();
        context.onContentChange(updatedContent);
        context.onUpdate?.(editor);
      }}
      onCreate={({ editor }) => {
        context.onCreate?.(editor);
      }}
      slotAfter={<Padder />}
      editorProps={{
        attributes: {
          class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-hidden text-(--dw-editor-foreground) max-w-(--editor-max-width)`,
        },
      }}
      extensions={extensions}
    >
      {children}
    </EditorProvider>
  );
}
