import { Note, NotePartial } from "@darkwrite/common";
import { INoteAPI } from "../types";
import { generateId } from "@renderer/lib/utils";
import { BrowserDBContext, IBrowserDBContext } from "./db-actions.browser";
import { StandaloneDarkwriteDocument } from "@renderer/lib/document-util";

export class BrowserNoteAPI implements INoteAPI {
  constructor(private _db: IBrowserDBContext = new BrowserDBContext()) {}

  async create(title: string, parent: string | undefined) {
    try {
      const note = {
        created: new Date(),
        icon: "",
        id: generateId(),
        modified: new Date(),
        title,
        parentID: parent,
      } satisfies Note;
      
      await this._db.addNote(note);
      return note;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async delete(id: string) {
    await this._db.deleteNote(id);
  }
  async duplicate(id: string) {
    const duplicate = await this._db.duplicateNote(id);
    return duplicate;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exportHTML(note: Note, content: string) {
    //TODO
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exportJSON(doc: StandaloneDarkwriteDocument){
    //TODO
  }

  async getContents(id: string) {
    return (await this._db.getDocument(id)) ?? null;
  }
  async getNote(id: string) {
    const value = await this._db.getNote(id);
    if (value == null) return null;
    return value;
  }
  async getNotes() {
    return await this._db.getNotes();
  }
  async importFile() {
    //TODO
    return null;
  }
  async move(sourceId: string, destinationId: string | undefined) {
    await this._db.updateNote({
      id: sourceId,
      parentID: destinationId
    });
  }
  async restore(id: string) {
    await this._db.updateNote({id, isTrashed: false})
  }
  async saveAll(notes: Note[]) {
    await this._db.saveAllNotes(notes);
  }
  async trash(id: string) {
    await this._db.updateNote({id, isTrashed: true})
  }
  async update(data: NotePartial) {
    await this._db.updateNote(data);
  }
  async updateContents(id: string, content: string) {
    this._db.saveDocument(id, content);
  }
}
