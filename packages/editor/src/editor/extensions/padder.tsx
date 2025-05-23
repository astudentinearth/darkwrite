import { useCurrentEditor } from "@tiptap/react";
import { useEditorUtil } from "../editor-util";

export function Padder(){
  const {editor} = useCurrentEditor();
  const util = useEditorUtil();
  const pad = ()=>{
    if(!editor) return;
    const lastNode = editor.state.doc.lastChild;
    if (lastNode && lastNode.type.name === "paragraph") {
      editor.chain().focus(util?.getEndPos()).run();
      return;
    }
    util?.insertParagraphAtEnd();
  }

  return (
    <div onClick={pad} className="w-full h-48 cursor-text"/>
  )
}