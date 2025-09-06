import { NoteCustomization } from "./note-customization";

export interface JSONDocument {
  [key: string]: JSONDocument
}

export interface NoteContent {
  contents: JSONDocument;
  customizations: NoteCustomization;
}