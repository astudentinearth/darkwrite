import { DocumentFileStore, IDocumentStore } from "../lib/document-store";

export class DocumentService{
  constructor(private documentStore: IDocumentStore = new DocumentFileStore()) {}
}