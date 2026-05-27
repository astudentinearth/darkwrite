import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

enum GrabHandleSide {
  LEFT,
  RIGHT,
}

const MIN_WIDTH_PERCENT = 5;
const MAX_WIDTH_PERCENT = 100;

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

  const setDisplayWidth = useCallback((percent: number) => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;
    const natural = image.naturalWidth;
    if (!natural) return; // not loaded yet — onLoad will re-apply
    currentWidth.current = percent;
    const target = natural * (percent / 100);
    container.style.setProperty("width", `min(${target}px, 100%)`);
  }, []);


  useEffect(() => {
    setDisplayWidth(props.node.attrs.widthPercent);
  }, [props.node.attrs.widthPercent, source, setDisplayWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const image = imageRef.current;
      if (!isResizing.current || !image) return;
      const outerContainer = image.closest(".node-dwimage");
      if (!outerContainer) return;
      const deltaX = e.clientX - initialX.current;
      const percentChange = (deltaX / outerContainer.clientWidth) * 100;

      const targetWidth =
        currentWidth.current +
        (activeHandle.current === GrabHandleSide.LEFT
          ? -percentChange
          : percentChange);

      const finalWidth = Math.min(
        MAX_WIDTH_PERCENT,
        Math.max(MIN_WIDTH_PERCENT, targetWidth),
      );

      setDisplayWidth(finalWidth);
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
  }, [setDisplayWidth, props]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    side: GrabHandleSide,
  ) => {
    e.preventDefault();
    const image = imageRef.current;
    if (image?.naturalWidth) {
      currentWidth.current = (image.clientWidth / image.naturalWidth) * 100;
    }
    isResizing.current = true;
    initialX.current = e.clientX;
    activeHandle.current = side;
  };

  return (
    <NodeViewWrapper className="dwimage flex justify-center h-fit py-2 w-full">
      <div
        data-drag-handle=""
        ref={containerRef}
        contentEditable={false}
        className={cn(
          "flex justify-center dwimage-container relative group h-fit p-1",
          (menuOpen || props.selected) && "bg-primary/20 rounded-sm",
        )}
      >
        {embedId == null || source === "" ? (
          <span className="opacity-50">Loading image...</span>
        ) : (
          <ContextMenu onOpenChange={setMenuOpen}>
            <ContextMenuTrigger asChild className="h-fit">
              <img
                ref={imageRef}
                draggable={false}
                className="h-auto p-0 my-0!"
                onLoad={() => setDisplayWidth(currentWidth.current)}
                data-drag-handle=""
                src={source}
              />
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onSelect={() => {
                  setDisplayWidth(100);
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
