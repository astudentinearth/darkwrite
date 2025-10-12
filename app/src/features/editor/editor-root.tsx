import { use, useEffect } from "react";
import { DarkwriteEditorContext } from "./context";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { DefaultEditorExtensions } from "./extensions/default";
import Bubble from "./extensions/bubble-menu";
import { SlashCommandRenderer } from "./extensions/slash-command/slash-command-renderer";
import slashCommandExtension from "./extensions/slash-command/slash-command-extension";
import { CodeBlockExtension } from "./extensions/code-block";
import { ImageExtension } from "./extensions/image/image-extension";
import { Padder } from "./extensions/padder";
import { BubbleMenu } from "@tiptap/react/menus";

function InstanceHandler() {
  const context = use(DarkwriteEditorContext);
  const editor = useCurrentEditor();
  useEffect(() => {
    if (!editor.editor) return;
    console.log(context.onInstanceChange);
    context.onInstanceChange?.call(undefined, editor.editor);
  }, [editor, context.onInstanceChange]);
  return <></>;
}

export function EditorRoot() {
  const context = use(DarkwriteEditorContext);
  const command = slashCommandExtension.configure({
    suggestion: {
      items: () => context.commandItems,
    },
  });
  const codeblock = CodeBlockExtension(context.codeBlockIndentSize);
  const imagePlugin = ImageExtension(context.imageUploadConfig);
  return (
    <EditorProvider
      content={context.content}
      onUpdate={({ editor }) => {
        const updatedContent = editor.getJSON();
        context.onContentChange(updatedContent);
      }}
      slotAfter={<Padder />}
      editorProps={{
        attributes: {
          class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-hidden text-(--dw-editor-foreground) max-w-(--editor-max-width)`,
        },
      }}
      extensions={[...DefaultEditorExtensions, command, codeblock, imagePlugin]}
    >
      <Bubble />
      <InstanceHandler />
    </EditorProvider>
  );
}
