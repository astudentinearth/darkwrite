import { IDocumentStore } from "@/electron/lib/document-store";

export class MockDocumentStore implements IDocumentStore {
  docs: Map<string, string> = new Map(); 
  async create(noteId: string) {
    this.docs.set(noteId, "");
  }
  
  async exists(noteId: string) {
    return this.docs.has(noteId);
  }

  async read(noteId: string) {
    return this.docs.get(noteId) ?? "";
  }
  
  async write(noteId: string, content: string) {
    this.docs.set(noteId, content);
  }
}