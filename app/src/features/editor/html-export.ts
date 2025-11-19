import { EditorContent } from "./types";
import { generateHTML as tiptapHTML } from "@tiptap/html";
import { DefaultEditorExtensions } from "./extensions/default";
import { CodeBlockExtension } from "./extensions";
import { ImageExtension } from "./extensions";
import _ from "lodash";

const defaultExtensions = [
  ...DefaultEditorExtensions,
  CodeBlockExtension(() => 4),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ImageExtension({} as any), // This configuration is irrelevant for HTML export
];

export const generateHTML = (content: EditorContent) => {
  const copy = _.cloneDeep(content);
  copy.type ??= "doc";
  copy.content ??= [];
  return tiptapHTML(copy, defaultExtensions);
};
