import { CreateNoteDTO, UpdateNoteDTO } from "@/common/dto";
import { DatabaseDAO } from "../database/database.dao";
import { Database, Note } from "../entity";
import { DocumentService } from "../service/document.service";
import { WorkspaceDAO } from "../workspace/workspace.dao";
import { NoteRankService } from "./note-rank.service";
import { NoteDAO } from "./note.dao";
import { Rank } from "@/common/rank";

export const NoteService = {
  async create(dto: CreateNoteDTO) {
    const {
      title,
      workspaceId,
      databaseId,
      icon,
      parentId,
      orderHint,
      favoriteOrderHint,
    } = dto;

    const workspace = await WorkspaceDAO.findByIdOrThrow(workspaceId);

    let database: Database | undefined = undefined;
    if (databaseId) database = await DatabaseDAO.findByIdOrThrow(databaseId);

    let note = new Note();
    note.title = title;
    note.workspace = workspace;
    if (orderHint) note.orderHint = orderHint;
    else
      note.orderHint = await NoteRankService.determineCreationRank(workspaceId);

    note.favoriteOrderHint = favoriteOrderHint;
    note.database = database;
    note.icon = icon;
    note.parentId = parentId;

    note = await NoteDAO.save(note);
    await new DocumentService().setNoteContent(note.id, "{}");
    return note;
  },

  async update(id: string, dto: UpdateNoteDTO) {
    const { workspaceId, databaseId, ...rest } = dto;

    //@ts-expect-error delete to prevent accidental assignment
    delete rest.workspace;

    //@ts-expect-error delete to prevent accidental assignment
    delete rest.database;

    const workspace = workspaceId
      ? await WorkspaceDAO.findByIdOrThrow(workspaceId)
      : undefined;
    const database = databaseId
      ? await DatabaseDAO.findByIdOrThrow(databaseId)
      : undefined;

    // reassign order key on restore
    const note = await NoteDAO.findByIdOrThrow(id);

    Object.assign(note, rest);
    if (dto.isTrashed === true) note.isFavorite = false;
    if (dto.isTrashed === false) {
      const lastNote = await NoteDAO.findLastNoteInOrder(note.workspace.id);
      const nextRank = lastNote
        ? new Rank(lastNote.orderHint).next()
        : Rank.default();
      note.orderHint = nextRank.get();
    }

    if (dto.isFavorite === true && !dto.favoriteOrderHint) {
      const lastInFavorites = await NoteDAO.findLastNoteInFavorites(
        note.workspace.id,
      );
      const nextRank = lastInFavorites
        ? new Rank(lastInFavorites.orderHint).next()
        : Rank.default();
      note.favoriteOrderHint = nextRank.get();
    }

    if (workspace) note.workspace = workspace;
    if (database) note.database = database;

    if ("databaseId" in dto && dto.databaseId === undefined)
      note.database = undefined;

    note.modified();
    return await NoteDAO.save(note);
  },

  async duplicate(id: string) {
    const note = await NoteDAO.findByIdOrThrow(id);
    const newNote: Note = new Note();
    newNote.icon = note.icon;
    newNote.title = `${note.title} (1)`;
    newNote.database = note.database;
    newNote.workspace = note.workspace;

    newNote.orderHint = await NoteRankService.determineCreationRank(
      note.workspace.id,
    );

    newNote.propertyValues = note.propertyValues;
    newNote.parentId = note.parentId;
    newNote.favoriteOrderHint = "";

    const saved = await NoteDAO.save(newNote);

    const doc = await new DocumentService().getNoteContent(id);
    await new DocumentService().setNoteContent(saved.id, JSON.stringify(doc));

    return saved;
  },

  async deleteById(id: string) {
    await NoteDAO.deleteById(id);
    await new DocumentService().deleteNoteContent(id);
  },

  async setModificationDate(id: string, date: Date) {
    const note = await NoteDAO.findByIdOrThrow(id);
    note.modifiedAt = date;
    await NoteDAO.save(note);
  },
};
