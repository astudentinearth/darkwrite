import { generateHTML as tiptapHTML } from "@tiptap/html";
import { MarkdownManager } from "@tiptap/markdown";
import _ from "lodash";
import { DarkwriteAPIClient } from "@/api/api-client";
import {
  CodeBlockExtension,
  DefaultEditorExtensions,
  DefaultMarkdownOptions,
  ImageExtension,
} from "@/features/editor/extensions";
import { Block, type EditorContent } from "@/features/editor/types";

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

const safeDocument = (content: EditorContent): EditorContent => {
  const copy = _.cloneDeep(content);
  copy.type ??= "doc";
  copy.content ??= [];
  return copy;
};

export const generateHTML = (content: EditorContent) => {
  return tiptapHTML(safeDocument(content), defaultExtensions);
};

export const generateMarkdown = (content: EditorContent) => {
  const md = new MarkdownManager({
    extensions: defaultExtensions,
    ...DefaultMarkdownOptions,
  });
  return md.serialize(safeDocument(content));
};
