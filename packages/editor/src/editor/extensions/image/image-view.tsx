import { useEmbedSource } from "@/editor/use-embed-source";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

export type DarkwriteImageAttributes = {
  embedId: string | null;
  pendingId: string | null;
};

export type DarkwriteImageViewProps = NodeViewProps & {
  node: {
    attrs: DarkwriteImageAttributes;
  };
  updateAttributes: (attrs: Partial<DarkwriteImageAttributes>) => void;
};

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