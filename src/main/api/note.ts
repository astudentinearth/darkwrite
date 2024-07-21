import { NoteMetada } from "@common/note";
import { AppDataSource } from "../db";
import { NoteEntity } from "../db/entity/note";
import { randomUUID } from "crypto";
import { join } from "path";
import { app } from "electron";
import fse from "fs-extra"
import { isNodeError } from "../util";
import log from "electron-log"

const notesDir = join(app.getPath("userData"), "notes/");

/**
 * Creates a new note by creating a database entry and a JSON file. A randomly generated UUID is assigned.
 * @param title Title of the note
 * @param parent Parent of the note
 */
export async function createNote(title: string, parent?: string){
    try {
        const note = new NoteEntity();
        note.title = title;
        note.created = new Date();
        note.modified = new Date();
        note.parentID = parent;
        note.isFavorite = false;
        note.isTrashed = false;
        note.subnotes = [];
        note.icon = ":page_facing_up:";
        note.id = randomUUID();
        const filename = join(notesDir, `${note.id}.json`);
        await fse.ensureFile(filename);
        await AppDataSource.manager.save(note);

        if(parent!=null){
            const parentNote = await AppDataSource.getRepository(NoteEntity).createQueryBuilder("note").where("note.id = :id", {id: parent}).getOne();
            if(parentNote==null) log.warn("A note was created with a non-existent parent");
            parentNote?.addSubnote(note.id);
            console.log(parentNote?.subnotes);
            if(parentNote) AppDataSource.manager.save(parentNote);
        }
    } catch (error) {
        if(error instanceof Error) log.error(error.message)
    }
}

/**
 * Updates the JSON file corresponding to the given ID
 * @param id Target note UUID
 * @param content New contents to **overwrite** with
 */
export async function setNoteContents(id: string, content: string){
    try {
        const filename = join(notesDir, `${id}.json`);
        await fse.ensureFile(filename);
        await fse.writeFile(filename, content);
    } catch (error) {
        if(error instanceof Error) log.error(error.message)
    }
}

/**
 * Loads data from a note's JSON file
 * @param id UUID of the note to load data from
 * @returns JSON contents of the note as string
 */
export async function getNoteContents(id: string){
    try {
        const filename = join(notesDir, `${id}.json`);
        const data = await fse.readFile(filename);
        return data;
    } catch (error) {
        if(isNodeError(error) && error.code === "ENOENT"){
            await AppDataSource.createQueryBuilder().delete().from(NoteEntity).where("id = :id", {id}).execute();
        }
        else{
            console.log((error instanceof Error) ? error.message : "Unknowm error in main/api/note/getNoteContets");
        }
        return null;
    }
}

/**
 * Deletes a note **permanently**
 * @param id UUID of the note to delete
 */
export async function deleteNote(id: string){
    try {
        const filename = join(notesDir, `${id}.json`);
        await fse.remove(filename);
        await AppDataSource.createQueryBuilder().delete().from(NoteEntity).where("id = :id", {id}).execute();
    } catch (error) {
        console.log((error instanceof Error) ? error.message : "Unknowm error in main/api/note/getNoteContets");
    }
}

/**
 * Moves the note
 * @param sourceID Source UUID
 * @param destID Destination UUID or undefined if the note is being moved to the top
 */
export async function moveNote(sourceID: string, destID: (string | undefined)){
    if(sourceID === destID) return;
    try {
        const source = await AppDataSource.getRepository(NoteEntity).createQueryBuilder("note").where("note.id = :id", {id: sourceID}).getOne();
        if(source?.parentID != null){
            // Note alrady has a parent, lets remove the relationship first
            const oldParent = await AppDataSource.getRepository(NoteEntity).createQueryBuilder("note").where("note.id = :id", {id: source.parentID}).getOne();
            if(oldParent != null){
                oldParent.removeSubnote(source.id);
                await AppDataSource.getRepository(NoteEntity).save(oldParent);
            }
        }
        if(destID == null && source != null){
            // We are moving the note to the top level
            source.parentID = null; // set parent to null
            source.subnotes = [];
            await AppDataSource.getRepository(NoteEntity).save(source);
            return;
        }
        const dest = await AppDataSource.getRepository(NoteEntity).createQueryBuilder("note").where("note.id = :id", {id: destID}).getOne();
        if(source == null || dest==null) return;
        source.parentID = destID;
        source.subnotes = [];
        dest.addSubnote(source.id);
        await AppDataSource.getRepository(NoteEntity).save(source);
        await AppDataSource.getRepository(NoteEntity).save(dest);

    } catch (error) {
        if(error instanceof Error) log.error(error.message)
    }
}

/**
 * Updates the database entry for given note
 * @param note 
 */
export async function updateNote(note: NoteMetada){
    try {
        // this cast might not work but it's worth trying
        await AppDataSource.getRepository(NoteEntity).save(note);
    } catch (error) {
        if(error instanceof Error) log.error(error.message)
    }
}

/**
 * Loads every row in the notes table
 * @returns a whole lot of notes
 */
export async function getAllNotes(){
    try{
        const notes = await AppDataSource.getRepository(NoteEntity).find();
        const arr: NoteMetada[] = [];
        for(const n of notes){
            arr.push({...n, subnotes: n.subnotes}); // spread does not get() for us methods
        }
        return arr;
    }
    catch(error){
        if(error instanceof Error) log.error(error.message);
        return null;
    }
}

/**
 * Moves a note to trash
 * @param id
 * @param state true moves into trash, false restores it
 */
export async function setTrashStatus(id: string, state: boolean){
    try {
        await AppDataSource.getRepository(NoteEntity)
        .createQueryBuilder("note")
        .where("note.id = :id", {id})
        .update({isTrashed: state})
        .execute();
    } catch (error) {
        if(error instanceof Error) log.error(error.message);
    }
}

/**
 * Finds a single note
 * @param id 
 */
export async function getNote(id: string){
    try {
        const note = await AppDataSource.getRepository(NoteEntity).createQueryBuilder("note").where("note.id = :id", {id}).getOne();
        return note;
    } catch (error) {
        if(error instanceof Error) log.error(error.message);
        return null;
    }
}