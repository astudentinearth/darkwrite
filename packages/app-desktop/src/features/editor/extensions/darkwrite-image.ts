import { EmbedAPI } from "@renderer/api";
import { cn } from "@renderer/lib/utils";
import { mergeAttributes } from "@tiptap/core";
import { TiptapImage } from "novel/extensions";
import { Plugin } from "prosemirror-state";
import { createImageNode, isImageFile } from "./image-upload";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DarkwriteImageView } from "./image-view";

/** @deprecated - use darkwrite/editor instead. */
export const DarkwriteImage = TiptapImage.extend({
  name: "dwimage",
  addAttributes() {
    return {
      ...this.parent?.(),
      embedId: {
        default: null,
        parseHTML: (element) => {
          return {
            embedId: element.getAttribute("data-embed-id"),
          };
        },
        renderHTML: (attributes) => {
          return {
            "data-embed-id": attributes.embedId,
          };
        },
      },
      pendingId: {
        default: null,
        parseHTML: (element) => {
          return {
            pendingId: element.getAttribute("data-pending-id"),
          };
        },
        renderHTML: (attributes) => {
          return {
            "data-pending-id": attributes.pendingId,
          };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "darkwrite-image" }),
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="darkwrite-image"]',
      },
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            if (!event.clipboardData) return;
            for (const item of event.clipboardData.items) {
              if (item.type.startsWith("image/")) {
                event.preventDefault();
                const filetype = item.type.slice("image/".length);
                const file = item.getAsFile();
                if (!file) return;
                file.arrayBuffer().then(async (buf) => {
                  const embed = await EmbedAPI().createFromArrayBuffer(
                    buf,
                    filetype,
                  );
                  const tr = view.state.tr;
                  const node = view.state.schema.nodes.dwimage.create({
                    src: `embed://${embed.id}`,
                    embedId: embed.id,
                  });
                  tr.replaceSelectionWith(node);
                  view.dispatch(tr);
                });
                console.log("An image was pasted", filetype);
              }
            }
          },
          handleDrop(view, event) {
            console.log(event.target);
            console.log(event.dataTransfer)
            if (!event.dataTransfer || event.dataTransfer.files.length < 1)
              return;
            for (const file of event.dataTransfer.files) {
              if (!isImageFile(file)) continue;
              event.preventDefault();
              //if (event.target && "nodeType" in event.target) return;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              if (!coordinates) return;
              createImageNode(file, view, coordinates.pos);
            }
          },
        },
      }),
    ];
  },
  addNodeView() {
    //@ts-expect-error Node view props are loosely compatible.
    return ReactNodeViewRenderer(DarkwriteImageView);
  },
}).configure({
  HTMLAttributes: {
    class: cn("rounded-lg border border-muted"),
  },
  allowBase64: true,
});
