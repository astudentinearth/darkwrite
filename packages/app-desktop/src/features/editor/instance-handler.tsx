import { useEditorState } from "@renderer/context/editor-state";
import { useEditor } from "novel";
import { useEffect } from "react";

/** @deprecated - use darkwrite/editor instead. */
export default function InstanceHandler() {
  const { editor } = useEditor();
  const setEditor = useEditorState((s) => s.setEditorInstance);
  useEffect(() => {
    setEditor(editor);
  }, [editor, setEditor]);
  return <></>;
}
