import { CreateNoteDTO, MoveNoteDTO, UpdateNoteDTO } from "@/common/dto";
import { DatabaseDAO } from "../database/database.dao";
import { Database, Note } from "../entity";
import { DocumentService } from "../service/document.service";
import { WorkspaceDAO } from "../workspace/workspace.dao";
import { NoteRankService } from "./note-rank.service";
import { NoteDAO } from "./note.dao";
import { Rank } from "@/common/rank";
import { ParentId } from "@/common/note";
import { AppDataSource } from "../db";

const noteDAO = new NoteDAO();

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

    note = await noteDAO.save(note);
    await new DocumentService().setNoteContent(note.id, "{}");
    return note;
  },

  async update(id: string, dto: UpdateNoteDTO) {
    const { databaseId, ...rest } = dto;

    const database = databaseId
      ? await DatabaseDAO.findByIdOrThrow(databaseId)
      : undefined;

    // reassign order key on restore
    const note = await noteDAO.findByIdOrThrow(id);

    Object.assign(note, rest);
    if (dto.isTrashed === true) note.isFavorite = false;
    if (dto.isTrashed === false) {
      const lastNote = await noteDAO.findLastNoteInOrder(note.workspace.id);
      const nextRank = lastNote
        ? new Rank(lastNote.orderHint).next()
        : Rank.default();
      note.orderHint = nextRank.get();
    }

    if (dto.isFavorite === true && !note.isFavorite) {
      const lastInFavorites = await noteDAO.findLastNoteInFavorites(
        note.workspace.id,
      );
      const nextRank = lastInFavorites
        ? new Rank(lastInFavorites.orderHint).next()
        : Rank.default();
      note.favoriteOrderHint = nextRank.get();
    }

    if (database) note.database = database;

    if ("databaseId" in dto && dto.databaseId === undefined)
      note.database = undefined;

    note.modified();
    return await noteDAO.save(note);
  },

  async move(dto: MoveNoteDTO) {
    if (dto.placement === "below") {
      if (!dto.destinationId)
        throw new Error(
          "Destination ID cannot be null when placement is 'below'.",
        );
      return await NoteService.moveBelow(dto.sourceId, dto.destinationId);
    } else {
      return await NoteService.moveInto(
        dto.sourceId,
        dto.destinationId,
        dto.placement === "inside-start" ? "start" : "end",
      );
    }
  },

  async moveBelow(sourceNoteNoteId: string, aboveNoteId: string) {
    return await AppDataSource.manager.transaction(async (manager) => {
      const noteRepository = NoteDAO.transactional(manager);

      const sourceNote = await noteRepository.findByIdOrThrow(sourceNoteNoteId);
      const aboveNote = await noteRepository.findByIdOrThrow(aboveNoteId);

      const siblings = await noteRepository.findAllByParentIdSortAsc(
        sourceNote.workspace.id,
        aboveNote.parentId,
      );
      const aboveIndex = siblings.findIndex((n) => n.id === aboveNote.id);
      const nextNote = siblings[aboveIndex + 1];

      let newOrderHint: string;
      if (nextNote) {
        try {
          const rank = new Rank(aboveNote.orderHint).between(
            new Rank(nextNote.orderHint),
          );
          newOrderHint = rank.get();
        } catch {
          const lastNote = siblings[siblings.length - 1];
          const rank = new Rank(lastNote.orderHint).next();
          newOrderHint = rank.get();
        }
      } else {
        const rank = new Rank(aboveNote.orderHint).next();
        newOrderHint = rank.get();
      }

      sourceNote.parentId = aboveNote.parentId;
      sourceNote.orderHint = newOrderHint;
      sourceNote.modified();

      return await noteRepository.save(sourceNote);
    });
  },

  async moveInto(
    sourceNoteId: string,
    destinationNoteId: ParentId,
    placement: "start" | "end" = "end",
  ) {
    return await AppDataSource.manager.transaction(async (manager) => {
      const noteRepository = NoteDAO.transactional(manager);

      const sourceNote = await noteRepository.findByIdOrThrow(sourceNoteId);
      const isCircular = await noteRepository.isDescendant(
        destinationNoteId,
        sourceNoteId,
      );
      if (isCircular) {
        throw new Error("Cannot move a note into its own descendant.");
      }

      if (destinationNoteId) {
        await noteRepository.findByIdOrThrow(destinationNoteId);
      }

      const newOrderHint: string = (
        await noteRepository.computeOrderKeysForLayer(
          sourceNote.workspace.id,
          destinationNoteId,
        )
      )[placement];

      sourceNote.parentId = destinationNoteId;
      sourceNote.orderHint = newOrderHint;
      sourceNote.modified();

      return await noteRepository.save(sourceNote);
    });
  },

  async duplicate(id: string) {
    const note = await noteDAO.findByIdOrThrow(id);
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

    const saved = await noteDAO.save(newNote);

    const doc = await new DocumentService().getNoteContent(id);
    await new DocumentService().setNoteContent(saved.id, JSON.stringify(doc));

    return saved;
  },

  async deleteById(id: string) {
    await noteDAO.deleteById(id);
    await new DocumentService().deleteNoteContent(id);
  },

  async setModificationDate(id: string, date: Date) {
    const note = await noteDAO.findByIdOrThrow(id);
    note.modifiedAt = date;
    await noteDAO.save(note);
  },
};
