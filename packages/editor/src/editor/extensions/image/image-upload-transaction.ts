import { EditorView } from "prosemirror-view";
import { nanoid } from "nanoid";
import { ImageExtensionConfig } from "./image-config";

function createImageNode(
  file: File,
  view: EditorView,
  pos: number,
  config: ImageExtensionConfig,
) {
  const id = `image-${nanoid(8)}`;
  const { state, dispatch } = view;
  const node = state.schema.nodes.dwimage.create({
    pendingId: id,
    src: "",
  });

  const tx = state.tr.insert(pos, node);
  dispatch(tx);

  config.uploadFile(file).then((id) => {
    const tr = view.state.tr;
    if (!id) return;
    tr.doc.descendants((node, pos) => {
      if (node.type.name === "dwimage" && node.attrs.pendingId === id) {
        tr.setNodeAttribute(pos, "src", `embed://${id}`);
        tr.setNodeAttribute(pos, "embedId", id);
        tr.setNodeAttribute(pos, "pendingId", "");
      }
    });
    if (tr.docChanged) view.dispatch(tr);
  });
}

export { createImageNode };
