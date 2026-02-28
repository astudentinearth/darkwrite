import { useCurrentEditor } from "@tiptap/react";
import { use, useEffect } from "react";
import { EditorEventBus, handleEditorEvent } from "../event/editor-bus";
import { EditorContext } from "../store/editor-context";

export function useEditorEvents() {
  const { editor } = useCurrentEditor();
  const { noteId } = use(EditorContext);

  useEffect(() => {
    if (!editor) return;
    const unsubscribe = EditorEventBus.subscribe(noteId, (e) => {
      handleEditorEvent(editor, e.data);
    });

    return () => unsubscribe();
  }, [editor, noteId]);

  if (!editor) return;
}
