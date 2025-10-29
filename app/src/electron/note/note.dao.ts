import { AppDataSource } from "../db";
import { Note } from "../entity";

const repo = AppDataSource.getRepository(Note);

export const NoteDAO = {
  save: async (note: Note) => repo.save(note),
  saveAll: async (notes: Note[]) => repo.save(notes),
  findById: async (id: string) => repo.findOne({ where: { id } }),
  findByIdOrThrow: async (id: string) => {
    const note = await repo.findOne({ where: { id } });
    if (!note) throw new Error(`Note with id ${id} not found.`);
    return note;
  },
  findAll: async () => repo.find(),

  findAllByWorkspaceId: async (workspaceId: string) =>
    repo.findBy({ workspace: { id: workspaceId } }),

  findAllByDatabaseId: async (databaseId: string) =>
    repo.findBy({ database: { id: databaseId } }),

  deleteById: async (id: string) => repo.delete({ id }),
  delete: async (note: Note) => repo.delete({ id: note.id }),

  findLastNoteInOrder: async (workspaceId: string) => {
    const result = await repo.findOne({
      order: {
        orderHint: "DESC",
      },
      where: { workspace: { id: workspaceId }, isTrashed: false },
    });
    return result;
  },

  findLastNoteInFavorites: async (workspaceId: string) => {
    const result = await repo.findOne({
      order: { favoriteOrderHint: "DESC" },
      where: {
        workspace: { id: workspaceId },
        isFavorite: true,
        isTrashed: false,
      },
    });
    return result;
  },
};
