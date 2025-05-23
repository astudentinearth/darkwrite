import { DarkwriteEditor, DarkwriteEditorProps } from "@darkwrite/editor";
import { ContextMenu, ContextMenuTrigger } from "@darkwrite/ui";
import { EditorContextMenuContent } from "../editor/context-menu";

export default function DarkwriteEditorView(props: DarkwriteEditorProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <DarkwriteEditor {...props}/> 
      </ContextMenuTrigger>
      <EditorContextMenuContent/>
    </ContextMenu>
   
  )
}