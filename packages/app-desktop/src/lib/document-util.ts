
import { type EditorContent as JSONContent } from "@darkwrite/editor";
import { NoteCustomizations, type Note } from "@darkwrite/common";

export interface DarkwriteDocument {
  customizations: NoteCustomizations,
  content: JSONContent
}

export type DocumentHeader = Pick<Note, "title" | "icon">

export interface StandaloneDarkwriteDocument extends DarkwriteDocument {
  meta: DocumentHeader
}

function isValidHeader(obj: {title: unknown, icon: unknown}): obj is DocumentHeader{
  return ((typeof obj.title === "string") && (typeof obj.icon === "string"))
}

function parseHeader(obj: unknown){
  if(obj == null || typeof obj !== "object") return null;
  if(!("title" in obj && "icon" in obj)) return null;
  if(!isValidHeader(obj)) return null;
  return obj satisfies DocumentHeader;
}

export const DocumentUtil = {
  createStandaloneJSONFile: (note: DocumentHeader, content: JSONContent, customizations: NoteCustomizations) => {
    const doc: StandaloneDarkwriteDocument = {
      meta: {title: note.title, icon: note.icon},
      customizations,
      content
    };
    return JSON.stringify(doc);
  },
  parseStandaloneJSONFile: (json: string) => {
    const obj = JSON.parse(json);
    const header = parseHeader(obj) ?? {icon: "", title: "Untitled note"};
    return {
      meta: header,
      content: obj.content ?? {},
      customizations: obj.customizations ?? {}
    } satisfies StandaloneDarkwriteDocument;
  }
}