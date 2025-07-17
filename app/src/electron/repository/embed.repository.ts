import { Repository } from "typeorm";
import { AppDataSource } from "../db";
import { Embed, Note } from "../entity";

export class EmbedRepository {
  private _repo: Repository<Embed>;
  constructor(private _datasource = AppDataSource) {
    this._repo = _datasource.getRepository(Embed);
  }

  async save(embed: Embed) {
    return this._repo.save(embed);
  }

  async saveAll(embeds: Embed[]) {
    return this._repo.save(embeds);
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

  async delete(embed: Embed) {
    return this._repo.delete({id: embed.id});
  }

}