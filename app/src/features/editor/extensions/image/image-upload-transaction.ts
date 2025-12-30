import { EditorView } from "@tiptap/pm/view";
import { nanoid } from "nanoid";
import { ImageExtensionConfig } from "./image-config";

function createImageNode(
  file: File,
  view: EditorView,
  pos: number,
  config: ImageExtensionConfig,
) {
  const pendingId = `image-${nanoid(8)}`;
  const { state, dispatch } = view;
  const node = state.schema.nodes.dwimage.create({
    pendingId: pendingId,
    src: "",
  });

  const tx = state.tr.insert(pos, node);
  dispatch(tx);

  config.uploadFile(file).then((embedId) => {
    const tr = view.state.tr;
    if (!pendingId) return;
    tr.doc.descendants((node, pos) => {
      if (node.type.name === "dwimage" && node.attrs.pendingId === pendingId) {
        tr.setNodeAttribute(pos, "src", `embed://${embedId}`);
        tr.setNodeAttribute(pos, "embedId", embedId);
        tr.setNodeAttribute(pos, "pendingId", "");
      }
    });
    if (tr.docChanged) view.dispatch(tr);
  });
}

export { createImageNode };
