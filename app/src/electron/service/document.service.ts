import { DocumentFileStore, IDocumentStore } from "../lib/document-store";
import { NOTE_CONTENTS_DIR } from "../lib/paths";

export class DocumentService{
  constructor(private documentStore: IDocumentStore = new DocumentFileStore(NOTE_CONTENTS_DIR)) {}

  async getNoteContent(noteId: string) {
    return this.documentStore.read(noteId);
  }

  async setNoteContent(noteId: string, content: string) {
    return this.documentStore.write(noteId, content);
  }

}