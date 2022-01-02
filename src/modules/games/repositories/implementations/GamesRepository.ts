import { count } from 'console';
import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("game")
      .where("LOWER(game.title) like LOWER(:title)", { title: `%${param}%` })
      .getMany();
    // Complete usando query builder
    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
      "select count(*) from games"
    ); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game: Game | undefined = await this.repository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.users", "user")
      .where("game.id = :id", { id: id })
      .getOne();

    if (game) {
      return game.users;
    } else {
      return [];
    }
    // Complete usando query builder
  }
}
