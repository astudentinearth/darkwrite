import { Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Workspace } from "../entity";

export class NoteRepository {
  private _repo: Repository<Workspace>;
  constructor(private _datasource = AppDataSource) {
    this._repo = _datasource.getRepository(Workspace);
  }

  async save(workspace: Workspace) {
    return this._repo.save(workspace);
  }

  async saveAll(workspaces: Workspace[]) {
    return this._repo.save(workspaces);
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

  async delete(workspace: Workspace) {
    return this._repo.delete({id: workspace.id});
  }

}