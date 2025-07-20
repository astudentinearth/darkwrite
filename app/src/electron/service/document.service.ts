import { DocumentFileStore, IDocumentStore } from "../lib/document-store";

export class DocumentService{
  constructor(private documentStore: IDocumentStore = new DocumentFileStore()) {}

  async getNoteContent(noteId: string) {
    return this.documentStore.read(noteId);
  }

  async setNoteContent(noteId: string, content: string) {
    return this.documentStore.write(noteId, content);
  }

}