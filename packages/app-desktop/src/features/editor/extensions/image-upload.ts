import { EmbedAPI } from "@renderer/api";
import { type EditorView } from "prosemirror-view";

/** @deprecated - use indexeddb embed api instead. */
const uploadEmbed = async (file: File) => {
  const api = EmbedAPI();
  const embed = await api.create(file);
  const uri = await api.resolveSourceURL(embed.id);
  return {...embed, uri};
};

export const isImageFile = (file: File) => {
  if (file.type.startsWith("image/")) return true;
  return false;
};

/** @deprecated - use darkwrite/editor instead. */
export const createImageNode = (file: File, view: EditorView, pos: number) => {
  // create placeholder node
  const id = `image-${Date.now()}`;
  //console.log("Creating image node", id);
  const { state, dispatch } = view;
  const node = state.schema.nodes.dwimage.create({
    pendingId: id,
    src: "",
  });
  const transaction = state.tr.insert(pos, node);
  dispatch(transaction);

  uploadEmbed(file).then((embed) => {
    const tr = view.state.tr;
    if (!embed) return;
    tr.doc.descendants((node, pos) => {
      if (node.type.name === "dwimage" && node.attrs.pendingId === id) {
        tr.setNodeAttribute(pos, "src", `embed://${embed.id}`);
        tr.setNodeAttribute(pos, "embedId", embed.id);
        //return false;
      }
      //return true;
    });
    if (tr.docChanged) {
      view.dispatch(tr);
    }
  });
};
