import { CreateNoteDTO, MoveNoteDTO, UpdateNoteDTO } from "@/common/dto";
import { ParentId } from "@/common/note";
import { Rank } from "@/common/rank";
import { DatabaseDAO } from "../database/database.dao";
import { AppDataSource } from "../db";
import { Note } from "../entity";
import { DocumentService } from "../service/document.service";
import { WorkspaceDAO } from "../workspace/workspace.dao";
import { NoteDAO } from "./note.dao";

const noteDAO = new NoteDAO();

export const NoteService = {
  async create(dto: CreateNoteDTO) {
    const { title, workspaceId, databaseId, icon, parentId } = dto;

    const workspace = await WorkspaceDAO.findByIdOrThrow(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const database = databaseId
      ? await DatabaseDAO.findByIdOrThrow(databaseId)
      : undefined;

    const orderKeys = await noteDAO.computeOrderKeysForLayer(
      workspaceId,
      parentId,
    );

    let note = new Note();
    note.title = title;
    note.workspace = workspace;
    note.orderHint = orderKeys.end;

    note.database = database;
    note.icon = icon;
    note.parentId = parentId;
    note.favoriteOrderHint = "";

    note = await noteDAO.save(note);
    await new DocumentService().setNoteContent(note.id, "{}");
    return note;
  },

  async update(id: string, dto: UpdateNoteDTO) {
    const { databaseId, ...rest } = dto;

    const database = databaseId
      ? await DatabaseDAO.findByIdOrThrow(databaseId)
      : undefined;

    const note = await noteDAO.findByIdOrThrow(id);

    Object.assign(note, rest);

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
    /*
      Edge cases:
      - Moving below a trashed note (not allowed)
      - Moving to the end of the list (no next note)
      - Rank collision (re-rank the entire layer) //TODO
    */

    return await AppDataSource.manager.transaction(async (manager) => {
      const noteRepository = NoteDAO.transactional(manager);

      const sourceNote = await noteRepository.findByIdOrThrow(sourceNoteNoteId);
      const aboveNote = await noteRepository.findByIdOrThrow(aboveNoteId);

      if (aboveNote.isTrashed || sourceNote.isTrashed) {
        throw new Error("Cannot move (below) a trashed note.");
      }

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

  async favorite(noteId: string, aboveNoteId?: string | null) {
    return AppDataSource.transaction(async (manager) => {
      const dao = NoteDAO.transactional(manager);
      const note = await dao.findByIdOrThrow(noteId);

      const indices = await dao.computeOrderKeysForFavorites(note.workspace.id);

      let newFavoriteOrderHint: string;
      if (!aboveNoteId) {
        newFavoriteOrderHint =
          aboveNoteId === null ? indices.start : indices.end;
      } else {
        const favorites = await dao.findAllFavorites(note.workspace.id);
        const aboveIndex = favorites.findIndex((n) => n.id === aboveNoteId);
        if (aboveIndex === -1 || aboveIndex + 1 >= favorites.length) {
          newFavoriteOrderHint = indices.end;
        } else {
          const aboveFavorite = favorites[aboveIndex];
          const belowFavorite = favorites[aboveIndex + 1];
          const rank = new Rank(aboveFavorite.favoriteOrderHint).between(
            new Rank(belowFavorite.favoriteOrderHint),
          );
          newFavoriteOrderHint = rank.get();
        }
      }
      note.isFavorite = true;
      note.favoriteOrderHint = newFavoriteOrderHint;

      return await dao.save(note);
    });
  },

  async unfavorite(noteId: string) {
    const note = await noteDAO.findByIdOrThrow(noteId);
    note.isFavorite = false;
    note.favoriteOrderHint = "";
    return await noteDAO.save(note);
  },

  async moveInto(
    sourceNoteId: string,
    destinationNoteId: ParentId,
    placement: "start" | "end" = "end",
  ) {
    return await AppDataSource.manager.transaction(async (manager) => {
      const noteRepository = NoteDAO.transactional(manager);

      const sourceNote = await noteRepository.findByIdOrThrow(sourceNoteId);

      if (sourceNote.isTrashed) {
        throw new Error("Cannot move a trashed note.");
      }

      const isCircular = await noteRepository.isDescendant(
        destinationNoteId,
        sourceNoteId,
      );
      if (isCircular) {
        throw new Error("Cannot move a note into its own descendant.");
      }

      if (destinationNoteId) {
        const dest = await noteRepository.findByIdOrThrow(destinationNoteId);
        if (dest.isTrashed) {
          throw new Error("Cannot move a note into a trashed note.");
        }
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
    newNote.title = `${note.title} (copy)`;
    newNote.database = note.database;
    newNote.workspace = note.workspace;

    newNote.orderHint = (
      await noteDAO.computeOrderKeysForLayer(note.workspace.id, note.parentId)
    ).end;

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

  async moveToTrash(id: string) {
    const note = await noteDAO.findByIdOrThrow(id);
    note.isTrashed = true;
    note.orderHint = "";
    note.favoriteOrderHint = "";
    note.isFavorite = false;
    return await noteDAO.save(note);
  },

  async restoreFromTrash(id: string) {
    const note = await noteDAO.findByIdOrThrow(id);
    note.isTrashed = false;

    if (note.parentId && !(await noteDAO.exists(note.parentId))) {
      note.parentId = null;
    }

    const orderKeys = await noteDAO.computeOrderKeysForLayer(
      note.workspace.id,
      note.parentId,
    );

    note.orderHint = orderKeys.end;
    return await noteDAO.save(note);
  },
};
