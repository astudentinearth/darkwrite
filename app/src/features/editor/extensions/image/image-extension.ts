import Image from "@tiptap/extension-image";
import ImageAttributes from "./image-attributes";
import { mergeAttributes } from "@tiptap/core";
import ImagePlugin from "./image-plugin";
import { ImageExtensionConfig } from "./image-config";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DarkwriteImageView } from "./image-view";
import { cn } from "@/lib/utils";

export const ImageExtension = (config: ImageExtensionConfig) =>
  Image.extend({
    name: "dwimage",
    addAttributes() {
      return { ...this.parent?.(), ...ImageAttributes };
    },
    parseHTML() {
      return [
        {
          tag: 'div[date-type="darkwrite-image"]',
        },
      ];
    },
    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
      if (HTMLAttributes["data-export"]) {
        return ["img", mergeAttributes(HTMLAttributes)];
      }
      return [
        "div",
        mergeAttributes(HTMLAttributes, { "data-type": "darkwrite-image" }),
      ];
    },
    addProseMirrorPlugins() {
      return [ImagePlugin(config)];
    },
    addNodeView() {
      //@ts-expect-error Props are loosely compatible
      return ReactNodeViewRenderer(DarkwriteImageView);
    },
  }).configure({
    HTMLAttributes: {
      class: cn("rounded-lg border border-muted"),
    },
    allowBase64: true,
  });
