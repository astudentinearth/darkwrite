import { use, useEffect } from "react";
import { DarkwriteEditorContext } from "./context";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { DefaultEditorExtensions } from "./extensions/default";
import Bubble from "./extensions/bubble-menu";
import { SlashCommandRenderer } from "./extensions/slash-command/slash-command-renderer";
import slashCommandExtension from "./extensions/slash-command/slash-command-extension";
import { codeBlock } from "./extensions/code-block";
import { ImageExtension } from "./extensions/image/image-extension";

function InstanceHandler() {
  const context = use(DarkwriteEditorContext);
  const editor = useCurrentEditor();
  useEffect(()=>{
    if(!editor.editor) return;
    context.onInstanceChange?.call(undefined, editor.editor);
  }, [editor, context.onInstanceChange]);
  return (<></>)
}

export function EditorRoot() {
  const context = use(DarkwriteEditorContext);
  const command = slashCommandExtension.configure({
    suggestion: {
      ...SlashCommandRenderer,
      items: ()=>context.commandItems
    },
  })
  const codeblock = codeBlock(context.codeBlockIndentSize);
  const imagePlugin = ImageExtension(context.imageUploadConfig);
  return <EditorProvider
    content={context.content}
    onUpdate={({ editor }) => {
      const updatedContent = editor.getJSON()
      context.onContentChange(updatedContent);
    }}
    editorProps={{
      attributes: {
        class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-hidden max-w-full text-(--dw-editor-foreground)`
      }
    }}
    extensions={[...DefaultEditorExtensions, command, codeblock, imagePlugin]}
  >
    <Bubble/>
    <InstanceHandler/>
  </EditorProvider>;
}
