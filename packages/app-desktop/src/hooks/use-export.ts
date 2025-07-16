import { Note, NoteExportType } from "@darkwrite/common";
import { NoteAPI } from "@/api";
import { generateHTML } from "@darkwrite/editor";
import { attempt } from "lodash";

/**
 * Hook to export a note in either JSON or HTML format.
 * @returns A function that takes a note and an optional export type.
 */
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
      if (type === "json") {
        NoteAPI().exportJSON({ meta: note, content: json.contents, customizations: json.customizations ?? {}})
      } else {
        const html = generateHTML(json.contents);
        NoteAPI().exportHTML(note, html);
      }
    }
  };
};
