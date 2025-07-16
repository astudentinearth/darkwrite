import { Note, NotePartial } from "@darkwrite/common";
import { INoteAPI } from "../types";
import { DocumentUtil } from "@/lib/document-util";

export const DesktopNoteAPI: INoteAPI = {
  async create(title: string, parent?: string) {
    try {
      const res = await window.api.note.create(title, parent);
      if (res == null) {
        throw new Error("Failed to create note.");
      }
      return res;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
      return null;
    }
  },

  async updateContents(id: string, content: string) {
    try {
      await window.api.note.setContents(id, content);
    } catch (error) {
      console.error(error);
    }
  },

  async getContents(id: string) {
    try {
      const res = await window.api.note.getContents(id);
      if (res == null) throw "";
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async delete(id: string) {
    try {
      await window.api.note.delete(id);
    } catch (error) {
      console.error(error);
    }
  },

  async move(sourceId: string, destinationId?: string) {
    try {
      await window.api.note.move(sourceId, destinationId);
    } catch (error) {
      console.error(error);
    }
  },

  async update(data: NotePartial) {
    await window.api.note.update(data);
  },

  async getNotes() {
    try {
      const res = await window.api.note.getAll();
      if (res == null) throw "";
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async trash(id: string) {
    await window.api.note.update({ id, isTrashed: true });
  },

  async restore(id: string) {
    await window.api.note.update({ id, isTrashed: false });
  },

  async getNote(id: string) {
    try {
      const res = await window.api.note.getNote(id);
      if (res == null) throw new Error("Failed to get note");
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async saveAll(notes: Note[]) {
    await window.api.note.saveAll(notes);
  },

  async exportHTML(note: Note, content: string) {
    try {
      await window.api.note.export(note.title, content, "html");
    } catch (error) {
      console.error(error);
    }
  },

  async exportJSON(doc) {
    await window.api.note.export(
      doc.meta.title,
      DocumentUtil.createStandaloneJSONFile(
        doc.meta,
        doc.content,
        doc.customizations,
      ),
      "json",
    );
  },

  async importFile() {
    try {
      const res = await window.api.note.import();
      return res;
    } catch {
      return null;
    }
  },

  async duplicate(id: string) {
    const original = await DesktopNoteAPI.getNote(id);
    if (!original) {
      console.error(
        `Failed to duplicate ${id} - could not load the source note.`,
      );
      return null;
    }
    const duplicate = await DesktopNoteAPI.create(
      `Copy of ${original.title}`,
      original.parentID ?? undefined,
    );
    if (!duplicate) {
      console.error(`Failed to duplicate ${id} - could not create a copy.`);
      return null;
    }
    await DesktopNoteAPI.update({ ...original, id: duplicate.id });
    const contents = await DesktopNoteAPI.getContents(original.id);
    if (!contents) {
      console.error(
        `Failed to duplicate ${id} - could not copy contents to duplicate.`,
      );
      return null;
    }
    await DesktopNoteAPI.updateContents(duplicate.id, contents);
    return duplicate;
  },
};
