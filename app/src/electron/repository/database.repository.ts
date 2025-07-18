import { Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Database } from "../entity";

export class DatabaseRepository {
  private _repo: Repository<Database>;
  constructor(private _datasource = AppDataSource) {
    this._repo = _datasource.getRepository(Database);
  }

  async save(database: Database) {
    return this._repo.save(database);
  }

  async saveAll(databases: Database[]) {
    return this._repo.save(databases);
  }

  async findById(id: string) {
    return this._repo.findOne({where: {id}});
  }

  async findAll() {
    return this._repo.findBy({});
  }

  async deleteById(id: string) {
    return this._repo.delete({id});
  }

  async delete(database: Database) {
    return this._repo.delete({id: database.id});
  }

}