import { useCurrentEditor } from "@tiptap/react";
import { use, useEffect } from "react";
import { EditorEventBus, handleEditorEvent } from "../event/editor-bus";
import { EditorEventType } from "../event/types";
import { EditorContext } from "../store/editor-context";

export function useEditorEvents() {
  const { editor } = useCurrentEditor();
  const { noteId, instanceId } = use(EditorContext);

  useEffect(() => {
    if (!editor) return;
    const unsubscribe = EditorEventBus.subscribe(noteId, (e) => {
      const event = e.data;

      if (
        event.type === EditorEventType.SYNC_CONTENT &&
        event.instanceId === instanceId
      ) {
        return;
      }

      if (
        "targetInstanceId" in event &&
        event.targetInstanceId !== instanceId
      ) {
        return;
      }

      handleEditorEvent(editor, event);
    });

    return () => unsubscribe();
  }, [editor, noteId, instanceId]);

  if (!editor) return;
}
