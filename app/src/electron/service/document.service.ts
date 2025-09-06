import { NoteContent } from "@/common/note-content";
import _ from "lodash";
import { DocumentFileStore, IDocumentStore } from "../lib/document-store";
import { NOTE_CONTENTS_DIR } from "../lib/paths";

export class DocumentService{
  constructor(private documentStore: IDocumentStore = new DocumentFileStore(NOTE_CONTENTS_DIR)) {}

  async toValidated(documentStr: string) {
     const document = _.attempt(()=>JSON.parse(documentStr));
    const returnValue: NoteContent = {contents: {}, customizations: {}};
    if(document instanceof Error) {
      return returnValue;
    }
    if("customizations" in document) returnValue.customizations = document.customizations;
    if("contents" in document) returnValue.contents = document.contents;
    return returnValue;
  }

  async getNoteContent(noteId: string) {
    const documentStr = await this.documentStore.read(noteId);
    return this.toValidated(documentStr);
  }

  async setNoteContent(noteId: string, content: string) {
    return this.documentStore.write(noteId, content);
  }

  async deleteNoteContent(noteId: string) {
    this.documentStore.delete(noteId);
  }

}