import { use, useEffect } from "react";
import { DarkwriteEditorContext } from "./context";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { DefaultEditorExtensions } from "./extensions/default";
import Bubble from "./extensions/bubble-menu";
import { SlashCommandRenderer } from "./extensions/slash-command/slash-command-renderer";
import slashCommandExtension from "./extensions/slash-command/slash-command-extension";
import { codeBlock } from "./extensions/code-block";

function InstanceHandler() {
  const context = use(DarkwriteEditorContext);
  const editor = useCurrentEditor();
  useEffect(()=>{
    console.log("Updating editor instance")
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
    extensions={[...DefaultEditorExtensions, command, codeblock]}
  >
    <Bubble/>
    <InstanceHandler/>
  </EditorProvider>;
}
