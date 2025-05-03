import { use, useEffect } from "react";
import { DarkwriteEditorContext } from "./context";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { DefaultEditorExtensions } from "./extensions/default";

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
    extensions={DefaultEditorExtensions}
  >
    <InstanceHandler/>
  </EditorProvider>;
}
