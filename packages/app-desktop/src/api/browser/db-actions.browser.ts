import { Embed, Note, NotePartial } from "@darkwrite/common";
import { BrowserDB, DarkwriteBrowserDB } from "./db.browser";
import { generateId } from "@renderer/lib/utils";

/** @deprecated use repos instead */
export class BrowserDBContext {
  constructor(private _db: DarkwriteBrowserDB = BrowserDB) {}

  public async addNote(note: Note) {
    const tx = (await this._db).transaction(
      ["note", "note-contents"],
      "readwrite",
    );
    const notesStore = tx.objectStore("note");
    const contentStore = tx.objectStore("note-contents");
    await notesStore.put(note);
    await contentStore.put("{}", note.id);
    await tx.done;
  }

  public async getNotes() {
    const notes = await (await this._db).getAll("note");
    notes.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    return notes;
  }

  public async getNote(id: string) {
    const value = (await this._db).get("note", id);
    return value;
  }

  public async getDocument(id: string) {
    const value = (await this._db).get("note-contents", id);
    return value;
  }

  public async updateNote(data: NotePartial) {
    const tx = (await this._db).transaction("note", "readwrite");
    const store = tx.objectStore("note");

    const existing = await store.get(data.id);
    if (!existing)
      throw new Error(`Failed to update ${data.id} because it does not exist.`);

    const updated = { ...existing, ...data };
    await store.put(updated);
    await tx.done;
  }

  public async saveDocument(id: string, content: string) {
    await (await this._db).put("note-contents", content, id);
  }

  public async saveAllNotes(notes: Note[]) {
    const tx = (await this._db).transaction("note", "readwrite");
    const store = tx.objectStore("note");
    notes.forEach(async (n) => {
      await store.put(n);
    });
    await tx.done;
  }

  public async deleteNote(id: string) {
    const tx = (await this._db).transaction(
      ["note", "note-contents"],
      "readwrite",
    );
    await tx.objectStore("note").delete(id);
    await tx.objectStore("note-contents").delete(id);
    await tx.done;
  }

  public async duplicateNote(id: string) {
    const tx = (await this._db).transaction(
      ["note", "note-contents"],
      "readwrite",
    );
    const noteStore = tx.objectStore("note");
    const documentStore = tx.objectStore("note-contents");
    const existing = await noteStore.get(id);
    let content = await documentStore.get(id);
    if (!existing) throw new Error("Requested note does not exist.");
    if (!content) content = "{}";
    const duplicate = {
      ...existing,
      id: generateId(),
    } satisfies Note;
    await documentStore.put(content, duplicate.id);
    await noteStore.put(duplicate);
    await tx.done;
    return duplicate;
  }

  public async createEmbed(embed: Embed, data: Blob) {
    const tx = (await this._db).transaction(
      ["embed", "embed-files"],
      "readwrite",
    );
    const embedStore = tx.objectStore("embed");
    const fileStore = tx.objectStore("embed-files");
    await embedStore.put(embed);
    await fileStore.put(data, embed.id);
    await tx.done;
  }

  public async getEmbed(id: string) {
    return (await this._db).get("embed", id);
  }

  public async getEmbeddedFile(id: string) {
    return (await this._db).get("embed-files", id);
  }
}

export type IBrowserDBContext = InstanceType<typeof BrowserDBContext>;
