import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useEmbedSource } from "../../use-embed-source";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui";
import { DarkwriteAPIClient } from "@/api/api-client";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const {t} = useTranslation();
  const source = useEmbedSource(embedId ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <NodeViewWrapper className="dwimage">
      <div
        data-drag-handle=""
        contentEditable={false}
        className="flex justify-center dwimage-container"
      >
        {embedId == null || source === "" ? (
          <span className="opacity-50">Loading image...</span>
        ) : (
          <ContextMenu onOpenChange={setMenuOpen}>
            <ContextMenuTrigger asChild>
              <img draggable={false} data-drag-handle="" className={cn(menuOpen && "outline outline-primary/50")} src={source} />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onSelect={() => {
                  DarkwriteAPIClient.embed.download(embedId);
                }}
              ><Download size={18} /> {t("editor.contextmenu.downloadImage")}</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
      </div>
    </NodeViewWrapper>
  );
};
