import { useEmbedSource } from "@renderer/hooks/use-embed-source";
import { Editor, NodeViewRendererProps, NodeViewWrapper } from "@tiptap/react";

/** @deprecated - use darkwrite/editor instead. */
export type DarkwriteImageAttributes = {
  embedId: string | null;
  pendingId: string | null;
};

/** @deprecated - use darkwrite/editor instead. */
export type DarkwriteImageViewProps = NodeViewRendererProps & {
  node: {
    attrs: DarkwriteImageAttributes;
  };
  updateAttributes: (attrs: Partial<DarkwriteImageAttributes>) => void;
  editor: Editor;
};

/** @deprecated - use darkwrite/editor instead. */
export const DarkwriteImageView = (props: DarkwriteImageViewProps) => {
  const { embedId } = props.node.attrs;
  const source = useEmbedSource(embedId ?? "");
  return (
    <NodeViewWrapper className="dwimage">
      <div
        data-drag-handle=""
        className="flex justify-center dwimage-container"
      >
        {(embedId == null || source === "") ? (
          <span className="opacity-50">Loading image...</span>
        ) : (
          <img draggable={false} data-drag-handle="" src={source} />
        )}
      </div>
    </NodeViewWrapper>
  );
};
