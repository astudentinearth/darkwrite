import { useCurrentEditor } from "@tiptap/react";
import { use, useEffect } from "react";
import { DarkwriteEditorContext } from "../context";
import EditorUtil from "../editor-util";
import { useEditorActions } from "../store/editor-actions";

export function FormattingHelper() {
  const { editor } = useCurrentEditor();
  const { setFormattingState } = useEditorActions();
  const { noteId } = use(DarkwriteEditorContext);

  useEffect(() => {
    if (!editor) return;
    const updateFormatting = () => {
      const state = EditorUtil(editor).getFormattingState();
      setFormattingState(noteId, state);
    };
    editor.on("selectionUpdate", updateFormatting);
    editor.on("update", updateFormatting);

    return () => {
      editor.off("selectionUpdate", updateFormatting);
      editor.off("update", updateFormatting);
    };
  }, [editor, noteId, setFormattingState]);

  return <></>;
}
