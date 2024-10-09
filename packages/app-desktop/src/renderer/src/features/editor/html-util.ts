import { generateJSON } from "@tiptap/html";
import { defaultExtensions } from "./extensions/extensions";

export function getJSON(html: string) {
  return generateJSON(html, [...defaultExtensions]);
}
