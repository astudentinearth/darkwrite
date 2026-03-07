import { type JSONContent } from "@tiptap/core";
import { NoteCustomization } from "./note-customization";

export interface JSONDocument {
  [key: string]: JSONDocument;
}

export interface NoteContent {
  contents: JSONContent;
  customizations: NoteCustomization;
}
