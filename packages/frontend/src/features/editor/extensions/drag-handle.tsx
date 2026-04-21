import DragHandle from "@tiptap/extension-drag-handle-react";
import { useCurrentEditor } from "@tiptap/react";
export function DragHandleExtension() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <DragHandle
      editor={editor}
      nested={{
        edgeDetection: {
          edges: ["left", "top"],
          threshold: 4,
          strength: 0,
        },
      }}
    >
      <div></div>
    </DragHandle>
  );
}
