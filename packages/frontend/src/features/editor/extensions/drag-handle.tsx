import DragHandle from "@tiptap/extension-drag-handle-react";
import { useCurrentEditor } from "@tiptap/react";
import { RefObject } from "react";

export type DragHandleExtensionProps = {
  isDragging: RefObject<boolean>;
};

export function DragHandleExtension({ isDragging }: DragHandleExtensionProps) {
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
      onElementDragStart={() => {
        isDragging.current = true;
      }}
      onElementDragEnd={() => {
        isDragging.current = false;
      }}
    >
      <div></div>
    </DragHandle>
  );
}
