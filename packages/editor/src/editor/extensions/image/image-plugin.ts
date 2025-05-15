import { Plugin } from "@tiptap/pm/state";
import { ImageExtensionConfig } from "./image-config";
import { createImageNode } from "./image-upload-transaction";

const ImagePlugin = (config: ImageExtensionConfig) =>
  new Plugin({
    props: {
      handlePaste(view, event) {
        if (!event.clipboardData) return;
        for (const item of event.clipboardData.items) {
          if (!item.type.startsWith("image/")) return;
          event.preventDefault();
          const filetype = item.type.slice("image/".length);
          const file = item.getAsFile();
          if (!file) return;
          file.arrayBuffer().then(async (buf) => {
            const id = await config.saveArrayBuffer(buf, filetype);
            const tr = view.state.tr;
            const node = view.state.schema.nodes.dwimage.create({
              src: `embed://${id}`,
              embedId: id,
            });
            tr.replaceSelectionWith(node);
            view.dispatch(tr);
          });
        }
      },
      handleDrop(view, event) {
        if (!event.dataTransfer || event.dataTransfer.files.length < 1) return;
        for (const file of event.dataTransfer.files) {
          if (!file.type.startsWith("image/")) continue;
          event.preventDefault();
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (!coordinates) return;
          createImageNode(file, view, coordinates.pos, config);
        }
      },
    },
  });

export default ImagePlugin;
