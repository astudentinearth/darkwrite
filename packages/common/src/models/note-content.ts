import { NoteCustomization } from "./note-customization";

export interface NoteContent {
  noteId: string;
  /** This should contain a serialized `EditorContent` instance. */
  content: string;
  customizations: NoteCustomization;
}