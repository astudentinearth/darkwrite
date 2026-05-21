import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { useEmbedSource } from "../../use-embed-source";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui";
import { DarkwriteAPIClient } from "@/api/api-client";
import { Download, RotateCcw } from "lucide-react";
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
  const maxWidth = useRef(0);
  const isResizing = useRef(false);
  const activeHandle = useRef(GrabHandleSide.LEFT);
  const currentWidth = useRef(props.node.attrs.widthPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const applyWidth = (percent: number) => {
    if (!containerRef.current || !imageRef.current) return;
    const natural = imageRef.current.naturalWidth;
    const outer = imageRef.current.closest(".node-dwimage");
    if (!outer) return;
    const px = Math.min(natural * (percent / 100), maxWidth.current);
    currentWidth.current = percent;
    containerRef.current.style.setProperty("width", `${px}px`);
  };

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

      applyWidth(finalWidth);
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
  }, [applyWidth]);

  useEffect(() => {
    const outer = containerRef.current?.closest(".node-dwimage")?.parentElement;
    if (!outer) return;

    const observer = new ResizeObserver(([entry]) => {
      maxWidth.current = entry.contentRect.width;
      applyWidth(currentWidth.current);
    });

    observer.observe(outer);
    return () => observer.disconnect();
  }, [applyWidth]);

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
                onLoad={() => applyWidth(currentWidth.current)}
                data-drag-handle=""
                src={source}
              />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onSelect={() => {
                  currentWidth.current = 100;
                  props.updateAttributes({ widthPercent: 100 });
                }}
              >
                <RotateCcw size={18} /> {t("ui.contextmenu.resetImageSize")}
              </ContextMenuItem>
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
          className="absolute p-0.5 top-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity -translate-y-1/2 left-1 cursor-ew-resize"
        >
          <div className="h-16 w-1.5 bg-white/80 border-border/50 shadow-sm shadow-black/50 rounded-full " />
        </div>
        <div
          onMouseDown={(e) => handleMouseDown(e, GrabHandleSide.RIGHT)}
          className="absolute p-0.5 top-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity -translate-y-1/2 right-1 cursor-ew-resize"
        >
          <div className="h-16 w-1.5 bg-white/80 border-border/50 shadow-sm shadow-black/50 rounded-full " />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
