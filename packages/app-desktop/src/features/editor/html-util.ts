import { generateJSON } from "@tiptap/html";
import { defaultExtensions } from "./extensions/extensions";

/** @deprecated - use darkwrite/editor instead. */
export function getJSON(html: string) {
  return generateJSON(html, [...defaultExtensions]);
}
