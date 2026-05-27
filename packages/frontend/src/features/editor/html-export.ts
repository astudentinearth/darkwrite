import { Block, type EditorContent } from "./types";
import { generateHTML as tiptapHTML } from "@tiptap/html";
import { DefaultEditorExtensions } from "./extensions/default";
import { CodeBlockExtension } from "./extensions";
import { ImageExtension } from "./extensions";
import _ from "lodash";
import { DarkwriteAPIClient } from "@/api/api-client";

const defaultExtensions = [
  ...DefaultEditorExtensions,
  CodeBlockExtension(() => 4),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ImageExtension({} as any), // This configuration is irrelevant for HTML export
];

export async function hydrateImages(content: EditorContent) {
  const copy = structuredClone(content);
  const imageNodes: EditorContent[] = [];

  function traverse(nodes: EditorContent) {
    if (!nodes.content || nodes.content.length == 0) return;
    for (const node of nodes.content) {
      if (node.type === Block.Image && node.attrs?.embedId) {
        imageNodes.push(node);
        continue;
      }
      traverse(node);
    }
  }
  traverse(copy);
  if (imageNodes.length == 0) return copy;
  const embedIds = imageNodes
    .map((n) => n.attrs!.embedId as string)
    .filter((id) => id != null);
  const dataUrlResult = await DarkwriteAPIClient.embed.getEncoded(embedIds);
  if (dataUrlResult.isErr()) return;
  const urls = dataUrlResult.value;
  for (const node of imageNodes) {
    if (!node.attrs) continue;
    node.attrs["src"] = urls[node.attrs!.embedId];
    node.attrs["data-export"] = "true";
  }
  return copy;
}

export const generateHTML = (content: EditorContent) => {
  const copy = _.cloneDeep(content);
  copy.type ??= "doc";
  copy.content ??= [];
  return tiptapHTML(copy, defaultExtensions);
};
