import { useEditorState } from "@renderer/context/editor-state";
import { useEditor } from "novel";
import { useEffect } from "react";

export function ContentHandler() {
  const { editor } = useEditor();
  const id = useEditorState((state) => state.id);
  const content = useEditorState((state) => state.content);
  useEffect(() => {
    console.log(content);
    if (id != "") {
      editor?.commands.setContent(content);
    }
  }, [id, content]);
  return <></>;
}
