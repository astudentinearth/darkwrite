import { type Attributes, mergeAttributes, Node } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { DarkwriteAPIClient } from "@/api/api-client";
import { Block } from "../types";
import { FileLinkNode } from "./file-link-node";

const ATTR_LINK_ID = "data-link-id";

export type FileLinkAttributesType = {
  linkId: string | null;
};

export const FileLinkAttributes: Attributes = {
  linkId: {
    default: null,
    isRequired: false,
    parseHTML(element) {
      return element.getAttribute(ATTR_LINK_ID);
    },
    renderHTML(attributes) {
      if (!attributes.linkId) {
        return {};
      }
      return {
        [ATTR_LINK_ID]: attributes.linkId,
      };
    },
  },
};

export const FileLinkProseMirrorPlugin = new Plugin({
  props: {
    handleDrop(view, event) {
      // this is for local file linking, meaningless on a browser
      if (!window.isElectron) return false;
      if (!event.dataTransfer || event.dataTransfer.files.length < 1)
        return false;
      for (const file of event.dataTransfer.files) {
        event.preventDefault();
        if (file.type.startsWith("image/")) continue; // defer to image plugin
        const path = window.webUtils.getPathForFile(file);
        const coords = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        if (path) {
          const nodeType = Block.LinkToLocalFile;
          DarkwriteAPIClient.fileLink.createFromPath(path).map((metadata) => {
            const tr = view.state.tr;
            const node = view.state.schema.nodes[nodeType].create({
              linkId: metadata.id,
            });
            const tx = tr.insert(
              coords?.pos || view.state.selection.from,
              node,
            );
            if (tx.docChanged) view.dispatch(tx);
          });
        }
      }
    },
  },
});

export const FileLinkExtension = Node.create({
  name: Block.LinkToLocalFile,
  group: "block",
  addAttributes: () => FileLinkAttributes,
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": Block.LinkToLocalFile }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FileLinkNode);
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${Block.LinkToLocalFile}"]`,
      },
    ];
  },
  draggable: true,
  atom: true,
  priority: 101,
  addProseMirrorPlugins: () => [FileLinkProseMirrorPlugin],
});
