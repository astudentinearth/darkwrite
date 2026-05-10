import { NoteContent } from "@darkwrite/common";
import _ from "lodash";
import { IDocumentStore } from "../lib/document-store";

function documentToJson(documentStr: string): NoteContent {
  const document = _.attempt(() => JSON.parse(documentStr));
  const returnValue: NoteContent = { contents: {}, customizations: {} };
  if (document instanceof Error) {
    return returnValue;
  }
  if ("customizations" in document)
    returnValue.customizations = document.customizations;
  if ("contents" in document) returnValue.contents = document.contents;
  return returnValue;
}

export function DocumentService(documentStore: IDocumentStore) {
  function getNoteContent(noteId: string) {
    return documentStore.read(noteId).map(documentToJson);
  }

  function setNoteContent(noteId: string, content: string) {
    return documentStore.write(noteId, content);
  }

  function deleteNoteContent(noteId: string) {
    return documentStore.delete(noteId);
  }

  return {
    getNoteContent,
    setNoteContent,
    deleteNoteContent,
  };
}

export type IDocumentService = ReturnType<typeof DocumentService>;
