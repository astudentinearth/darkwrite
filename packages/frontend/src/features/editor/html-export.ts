import { generateHTML as tiptapHTML } from "@tiptap/html";
import _ from "lodash";
import { DarkwriteAPIClient } from "@/api/api-client";
import { CodeBlockExtension, ImageExtension } from "./extensions";
import { DefaultEditorExtensions } from "./extensions/default";
import { Block, type EditorContent } from "./types";

const defaultExtensions = [
  ...DefaultEditorExtensions,
  CodeBlockExtension(() => 4),
  // biome-ignore lint/suspicious/noExplicitAny: This configuration is irrelevant for HTML export
  ImageExtension({} as any),
];

export async function hydrateImages(content: EditorContent) {
  const copy = structuredClone(content);
  const imageNodes: EditorContent[] = [];

  function traverse(nodes: EditorContent) {
    if (!nodes.content || nodes.content.length === 0) return;
    for (const node of nodes.content) {
      if (node.type === Block.Image && node.attrs?.embedId) {
        imageNodes.push(node);
        continue;
      }
      traverse(node);
    }
  }
  traverse(copy);
  if (imageNodes.length === 0) return copy;

  // biome-ignore-start lint/style/noNonNullAssertion: images cannot exist without it
  const embedIds = imageNodes
    .map((n) => n.attrs!.embedId as string)
    .filter((id) => id != null);
  const dataUrlResult = await DarkwriteAPIClient.embed.getEncoded(embedIds);
  if (dataUrlResult.isErr()) return;
  const urls = dataUrlResult.value;
  for (const node of imageNodes) {
    if (!node.attrs) continue;
    node.attrs.src = urls[node.attrs!.embedId];
    node.attrs["data-export"] = "true";
  }
  return copy;
  // biome-ignore-end lint/style/noNonNullAssertion: images cannot exist without it
}

export const generateHTML = (content: EditorContent) => {
  const copy = _.cloneDeep(content);
  copy.type ??= "doc";
  copy.content ??= [];
  return tiptapHTML(copy, defaultExtensions);
};
