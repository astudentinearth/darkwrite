import { Note, NoteExportType } from "@darkwrite/common";
import { NoteAPI } from "@renderer/api";
import { defaultExtensions } from "@renderer/features/editor/extensions/extensions";
import { generateHTML } from "@tiptap/html";
import { attempt } from "lodash";

/** @deprecated replacement needed! */
export const useExport = () => {
  return async (note: Note, type: NoteExportType = "html") => {
    const result = await NoteAPI().getContents(note.id);
    if (!result) {
      console.error("Failed to export note: could not load document.");
      return;
    }
    const json = attempt(() => JSON.parse(result));
    if (json instanceof Error) {
      console.error(json);
      return;
    }
    if ("contents" in json && json.contents != null && typeof json.contents === "object") {
      if (!("content" in json.contents && "type" in json.contents)) {
        json.contents.content = [];
        json.contents.type = "doc";
      }
      if (type === "json") {
        NoteAPI().exportJSON({ meta: note, content: json.contents, customizations: json.customizations ?? {}})
      } else {
        const html = generateHTML(json.contents, [...defaultExtensions]);
        NoteAPI().exportHTML(note, html);
      }
    }
  };
};
