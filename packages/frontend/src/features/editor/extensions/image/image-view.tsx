import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
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
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

enum GrabHandleSide {
  LEFT,
  RIGHT,
}

export type DarkwriteImageAttributes = {
  embedId: string | null;
  pendingId: string | null;
  widthPercent: number;
};

export type DarkwriteImageViewProps = ReactNodeViewProps & {
  node: {
    attrs: DarkwriteImageAttributes;
  };
  updateAttributes: (attrs: Partial<DarkwriteImageAttributes>) => void;
};

export const DarkwriteImageView = (props: DarkwriteImageViewProps) => {
  const { embedId } = props.node.attrs;
  const { t } = useTranslation();
  const source = useEmbedSource(embedId ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  const initialX = useRef(0);
  const isResizing = useRef(false);
  const activeHandle = useRef(GrabHandleSide.LEFT);
  const currentWidth = useRef(props.node.attrs.widthPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !imageRef.current || !containerRef.current)
        return;
      const deltaX = e.clientX - initialX.current;
      const outerContainer = imageRef.current.closest(".node-dwimage");
      if (!outerContainer) return;
      const percentChange = (deltaX / outerContainer.clientWidth) * 100;

      const targetWidth =
        currentWidth.current +
        (activeHandle.current == GrabHandleSide.LEFT
          ? -percentChange
          : percentChange);

      const finalWidth =
        targetWidth > 100 ? 100 : targetWidth < 25 ? 25 : targetWidth;

      currentWidth.current = finalWidth;
      containerRef.current.style.setProperty("width", `${finalWidth}%`);
      initialX.current = e.clientX;
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        props.updateAttributes({ widthPercent: currentWidth.current });
      }
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    side: GrabHandleSide,
  ) => {
    e.preventDefault();
    isResizing.current = true;
    initialX.current = e.clientX;
    activeHandle.current = side;
  };

  return (
    <NodeViewWrapper className="dwimage flex justify-center">
      <div
        data-drag-handle=""
        ref={containerRef}
        contentEditable={false}
        style={{ width: `${props.node.attrs.widthPercent}%` }}
        className={cn(
          "flex justify-center dwimage-container relative group",
          (menuOpen || props.selected) && "bg-primary/20 rounded-md",
        )}
      >
        {embedId == null || source === "" ? (
          <span className="opacity-50">Loading image...</span>
        ) : (
          <ContextMenu onOpenChange={setMenuOpen}>
            <ContextMenuTrigger asChild>
              <img
                ref={imageRef}
                draggable={false}
                data-drag-handle=""
                src={source}
              />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onSelect={() => {
                  DarkwriteAPIClient.embed.download(embedId);
                }}
              >
                <Download size={18} /> {t("ui.contextmenu.downloadImage")}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
        <div
          onMouseDown={(e) => handleMouseDown(e, GrabHandleSide.LEFT)}
          className="absolute p-0.5 top-1/2 hidden group-hover:block -translate-y-1/2 left-1 cursor-ew-resize"
        >
          <div className="h-16 w-1.5 bg-white/80 border-border/50 shadow-sm shadow-black/50 rounded-full " />
        </div>
        <div
          onMouseDown={(e) => handleMouseDown(e, GrabHandleSide.RIGHT)}
          className="absolute p-0.5 top-1/2 hidden group-hover:block -translate-y-1/2 right-1 cursor-ew-resize"
        >
          <div className="h-16 w-1.5 bg-white/80 border-border/50 shadow-sm shadow-black/50 rounded-full " />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
