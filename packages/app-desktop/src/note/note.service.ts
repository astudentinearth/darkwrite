import { DatabaseDAO } from "@/database/database.dao";
import { DatabaseType } from "@/db";
import { NewNote } from "@/db/schema";
import { logError } from "@/lib/log";
import { DocumentService } from "@/service/document.service";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import {
  CreateNoteDTO,
  IllegalArgumentError,
  MoveNoteDTO,
  ParentId,
  Rank,
  UpdateNoteDTO,
} from "@darkwrite/common";
import { NoteDAO } from "./note.dao";

export class NoteService {
  private noteDAO: NoteDAO;
  private workspaceDAO: WorkspaceDAO;
  private databaseDAO: DatabaseDAO;
  constructor(
    private db: DatabaseType,
    private documentService = new DocumentService(),
    noteDAO?: NoteDAO,
    workspaceDAO?: WorkspaceDAO,
    databaseDAO?: DatabaseDAO,
  ) {
    this.noteDAO = noteDAO ?? new NoteDAO(db);
    this.workspaceDAO = workspaceDAO ?? new WorkspaceDAO(db);
    this.databaseDAO = databaseDAO ?? new DatabaseDAO(db);
  }

  async create(dto: CreateNoteDTO) {
    const { title, workspaceId, databaseId, icon, parentId } = dto;

    return await this.db.transaction(async (tx) => {
      const noteDao = this.noteDAO.transactional(tx);
      const workspaceDao = this.workspaceDAO.transactional(tx);

      const workspace = await workspaceDao.findByIdOrThrow(workspaceId);
      const orderKeys = await noteDao.computeOrderKeysForLayer(
        workspace.id,
        parentId,
      );

      const note: NewNote = {
        title,
        workspaceId,
        orderHint: orderKeys.end,
        databaseId,
        icon,
        parentId,
        favoriteOrderHint: "",
        createdAt: new Date(),
        modifiedAt: new Date(),
      };

      const result = await noteDao.create(note);
      if (!result) {
        throw new Error("Failed to create note");
      }
      await this.documentService.setNoteContent(result.id, "{}");
      return result;
    });
  }

  async update(id: string, dto: UpdateNoteDTO) {
    const { databaseId, ...rest } = dto;

    return await this.db.transaction(async (tx) => {
      const databaseDao = this.databaseDAO.transactional(tx);
      const noteDao = this.noteDAO.transactional(tx);

      const database = databaseId
        ? await databaseDao.findByIdOrThrow(databaseId)
        : undefined;

      const note = await noteDao.findByIdOrThrow(id);

      Object.assign(note, rest);
      if (database) note.databaseId = database.id;

      note.modifiedAt = new Date();

      return await noteDao.update(note);
    });
  }

  async move(dto: MoveNoteDTO) {
    if (dto.placement === "below") {
      if (!dto.destinationId)
        throw new IllegalArgumentError(
          "Destination ID cannot be null when placement is 'below'.",
        );
      return await this.moveBelow(dto.sourceId, dto.destinationId);
    } else {
      return await this.moveInto(
        dto.sourceId,
        dto.destinationId,
        dto.placement === "inside-start" ? "start" : "end",
      );
    }
  }

  async moveBelow(sourceNoteNoteId: string, aboveNoteId: string) {
    /*
      Edge cases:
      - Moving below a trashed note (not allowed)
      - Moving to the end of the list (no next note)
      - Rank collision (re-rank the entire layer) //TODO
    */

    return await this.db.transaction(async (tx) => {
      const noteRepository = this.noteDAO.transactional(tx);

      const sourceNote = await noteRepository.findByIdOrThrow(sourceNoteNoteId);
      const aboveNote = await noteRepository.findByIdOrThrow(aboveNoteId);

      if (aboveNote.isTrashed || sourceNote.isTrashed) {
        throw new IllegalArgumentError("Cannot move (below) a trashed note.");
      }

      const siblings = await noteRepository.findAllByParentIdSortAsc(
        sourceNote.workspaceId,
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
      sourceNote.modifiedAt = new Date();

      return await noteRepository.update(sourceNote);
    });
  }

  async favorite(noteId: string, aboveNoteId?: string | null) {
    return this.db.transaction(async (tx) => {
      const dao = this.noteDAO.transactional(tx);
      const note = await dao.findByIdOrThrow(noteId);

      const indices = await dao.computeOrderKeysForFavorites(note.workspaceId);

      let newFavoriteOrderHint: string;
      if (!aboveNoteId) {
        newFavoriteOrderHint =
          aboveNoteId === null ? indices.start : indices.end;
      } else {
        const favorites = await dao.findAllFavorites(note.workspaceId);
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

      const result = await dao.update(note);
      if (!result) throw new Error("Failed to favorite note");
      return result;
    });
  }

  async unfavorite(noteId: string) {
    return await this.db.transaction(async (tx) => {
      const dao = this.noteDAO.transactional(tx);
      const note = await dao.findByIdOrThrow(noteId);
      const result = await dao.update({
        id: note.id,
        isFavorite: false,
        favoriteOrderHint: "",
      });
      if (!result) throw new Error("Failed to unfavorite note");
      return result;
    });
  }

  /** Moves a note into another note with given placement order. The destination note must not be a child of the source note, and the neither notes can be trashed.
   * @param sourceNoteId the note that moves
   * @param destinationNoteId the note that receives the child
   * @param [placement="end"] whether to move at the start or end of the layer (default: `"end"`)
   */
  async moveInto(
    sourceNoteId: string,
    destinationNoteId: ParentId,
    placement: "start" | "end" = "end",
  ) {
    return await this.db.transaction(async (tx) => {
      const noteRepository = this.noteDAO.transactional(tx);

      const sourceNote = await noteRepository.findByIdOrThrow(sourceNoteId);

      if (sourceNote.isTrashed) {
        throw new IllegalArgumentError("Cannot move a trashed note.");
      }

      const isCircular = destinationNoteId
        ? await noteRepository.isDescendant(destinationNoteId, sourceNoteId)
        : false;
      if (isCircular) {
        throw new IllegalArgumentError(
          "Cannot move a note into its own descendant.",
        );
      }

      if (destinationNoteId) {
        const dest = await noteRepository.findByIdOrThrow(destinationNoteId);
        if (dest.isTrashed) {
          throw new IllegalArgumentError(
            "Cannot move a note into a trashed note.",
          );
        }
      }

      const newOrderHints = await noteRepository.computeOrderKeysForLayer(
        sourceNote.workspaceId,
        destinationNoteId,
      );

      sourceNote.parentId = destinationNoteId;
      sourceNote.orderHint = newOrderHints[placement];
      sourceNote.modifiedAt = new Date();

      return await noteRepository.update(sourceNote);
    });
  }

  async duplicate(id: string) {
    const { icon, title, databaseId, workspaceId, propertyValues, parentId } =
      await this.noteDAO.findByIdOrThrow(id);

    const newNote: NewNote = {
      title: `${title} (copy)`,
      icon,
      databaseId,
      workspaceId,
      propertyValues,
      parentId,
      orderHint: (
        await this.noteDAO.computeOrderKeysForLayer(workspaceId, parentId)
      ).end,
      favoriteOrderHint: "",
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    return await this.db.transaction(async (tx) => {
      const saved = await this.noteDAO.transactional(tx).create(newNote);
      const doc = await this.documentService.getNoteContent(id);
      await this.documentService.setNoteContent(saved.id, JSON.stringify(doc));
      return saved;
    });
  }

  async deleteById(id: string) {
    return await this.db.transaction(async (tx) => {
      await this.noteDAO.transactional(tx).deleteById(id);
      try {
        await this.documentService.deleteNoteContent(id);
      } catch (e: unknown) {
        logError(e);
        tx.rollback();
      }
    });
  }

  async moveToTrash(id: string) {
    return await this.db.transaction(async (tx) => {
      const dao = this.noteDAO.transactional(tx);
      const result = await dao.update({
        id,
        isTrashed: true,
        orderHint: "",
        favoriteOrderHint: "",
        isFavorite: false,
      });
      if (!result) throw new Error("Failed to move note to trash");
      return result;
    });
  }

  async setModificationDate(id: string, date: Date) {
    return await this.db.transaction(async (tx) => {
      const dao = this.noteDAO.transactional(tx);
      const result = await dao.update({
        id,
        modifiedAt: date,
      });
      if (!result) throw new Error("Failed to update note modification date");
      return result;
    });
  }

  async restoreFromTrash(id: string) {
    return await this.db.transaction(async (tx) => {
      const noteDAO = this.noteDAO.transactional(tx);
      const note = await noteDAO.findByIdOrThrow(id);
      note.isTrashed = false;

      if (note.parentId && !(await noteDAO.exists(note.parentId))) {
        note.parentId = null;
      }

      const orderKeys = await noteDAO.computeOrderKeysForLayer(
        note.workspaceId,
        note.parentId,
      );

      note.orderHint = orderKeys.end;
      const result = await noteDAO.update(note);
      if (!result) throw new Error("Failed to restore note from trash.");
      return result;
    });
  }

  /** **Permanently** deletes all notes in the trash of the given workspace. */
  async emptyTrash(workspaceId: string) {
    return await this.db.transaction(async (tx) => {
      const noteDAO = this.noteDAO.transactional(tx);
      const trashedNotes = await noteDAO.findAllTrashed(workspaceId);
      await Promise.all(
        trashedNotes.map((note) =>
          this.documentService.deleteNoteContent(note.id),
        ),
      );
      await noteDAO.deleteMany(trashedNotes.map((n) => n.id));
    });
  }
}
