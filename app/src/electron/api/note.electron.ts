import { Note, NoteExportType, NotePartial } from "@darkwrite/common";
import fse from "fs-extra";
import { AppDataSource, DB } from "@main/db";
import { NoteEntity } from "@main/db/entity/note";
import { getNotePath } from "@main/lib/paths";
import { isNodeError } from "@main/util";
import { logError } from "@main/lib/log";
import { rmIfExists } from "@main/lib/fs";
import { saveFile } from "./dialog";

/**
 * Creates a new note by creating a database entry and a JSON file. A randomly generated UUID is assigned.
 * @param title Title of the note
 * @param parent Parent of the note
 */
export async function createNote(title: string, parent?: string) {
  try {
    console.log("Creating note");
    const note = await DB.note.create(title, parent);
    const filename = getNotePath(note.id);
    await fse.ensureFile(filename);
    return note;
  } catch (error) {
    logError(error);
    return null;
  }
}

/**
 * Updates the JSON file corresponding to the given ID
 * @param id Target note UUID
 * @param content New contents to **overwrite** with
 */
export async function setNoteContents(id: string, content: string) {
  try {
    const filename = getNotePath(id);
    await fse.ensureFile(filename);
    await fse.writeFile(filename, content);
  } catch (error) {
    logError(error);
  }
}

/**
 * Loads data from a note's JSON file. If the file does not exist, assumes the note was deleted and removes the database entry.
 * @param id UUID of the note to load data from
 * @returns JSON contents of the note as string
 */
export async function getNoteContents(id: string) {
  try {
    const filename = getNotePath(id);
    const data = await fse.readFile(filename);
    return data.toString("utf8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(NoteEntity)
        .where("id = :id", { id })
        .execute();
    } else {
      logError(error, "Unknown error in getNoteContents API");
    }
    return null;
  }
}

/**
 * Deletes a note **permanently**
 * @param id UUID of the note to delete
 */
export async function deleteNote(id: string) {
  try {
    const filename = getNotePath(id);
    await rmIfExists(filename);
    await DB.note.delete(id); // delete the note
    //FIXME: This is not recursive and leaves behind the JSON files.
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(NoteEntity)
      .where("parentID = :id", { id })
      .execute(); // delete its subnotes
  } catch (error) {
    logError(error);
  }
}

/**
 * Moves the note
 * @param sourceID Source UUID
 * @param destID Destination UUID or undefined if the note is being moved to the top
 */
export async function moveNote(sourceID: string, destID: string | undefined) {
  if (sourceID === destID) return;
  try {
    const source = await AppDataSource.getRepository(NoteEntity)
      .createQueryBuilder("note")
      .where("note.id = :id", { id: sourceID })
      .getOne();
    if (destID == null && source != null) {
      // We are moving the note to the top level
      source.parentID = null; // set parent to null
      await DB.note.update(source);
      return;
    }
    if (source == null) return;
    source.parentID = destID;
    await DB.note.update(source);
  } catch (error) {
    logError(error);
  }
}

/**
 * Updates the database entry for given note
 * @param note
 */
export async function updateNote(note: NotePartial) {
  try {
    await DB.note.update(note);
  } catch (error) {
    logError(error);
  }
}

/**
 * Loads every row in the notes table
 * @returns a whole lot of notes
 */
export async function getAllNotes(): Promise<Note[] | null> {
  try {
    const notes = await DB.note.getAll();
    return notes;
  } catch (error) {
    logError(error);
    return null;
  }
}

/**
 * Moves a note to trash
 * @param id
 * @param state true moves into trash, false restores it
 * @deprecated Use `updateNote` instead.
 */
export async function setTrashStatus(id: string, state: boolean) {
  try {
    await DB.note.update({ id, isTrashed: state });
  } catch (error) {
    logError(error);
  }
}

/**
 * Finds a single note
 * @param id
 */
export async function getNote(id: string) {
  try {
    const note = await AppDataSource.getRepository(NoteEntity)
      .createQueryBuilder("note")
      .where("note.id = :id", { id })
      .getOne();
    return note;
  } catch (error) {
    logError(error);
    return null;
  }
}

/**
 * Updates an array of notes at once
 * @param notes
 */
export async function saveNotes(notes: Note[]) {
  try {
    await AppDataSource.getRepository(NoteEntity).save(
      NoteEntity.fromMetadataArray(notes),
    );
  } catch (error) {
    logError(error);
  }
}

export async function exportNote(
  title: string,
  content: string,
  exportType: NoteExportType,
) {
  const { canceled, path } = await saveFile({
    title: "Export note",
    buttonLabel: "Export",
    defaultPath: `${title}.${exportType}`,
  });
  if (canceled || !path) return;
  await fse.writeFile(path, content);
}
