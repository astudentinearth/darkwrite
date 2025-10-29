import { AppDataSource } from "../db";
import { Database } from "../entity";

const repo = AppDataSource.getRepository(Database);

export const DatabaseDAO = {
  save: async (database: Database) => repo.save(database),
  saveAll: async (databases: Database[]) => repo.save(databases),
  findById: async (id: string) => repo.findOne({ where: { id } }),

  findByIdOrThrow: async (id: string) => {
    const database = await repo.findOne({ where: { id } });
    if (!database) throw new Error(`Database with id ${id} not found.`);
    return database;
  },

  findAll: async () => repo.find(),
  deleteById: async (id: string) => repo.delete({ id }),
  delete: async (database: Database) => repo.delete({ id: database.id }),
};
