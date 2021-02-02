import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  MikroORM,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';

@Injectable()
/**
 * Instance to communicate with the User collection in our database
 */

// TODO: auf andere Klassen auch übertragen
export class UserDbService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  userRepository: EntityRepository<User> = this.em.getRepository(User);

  getUserRepository(): EntityRepository<User>{
    return this.userRepository
  }

  async insertUser(user: User): Promise<boolean > {
    return this.userRepository.persistAndFlush(user).then(res => { return res == undefined ? true : false})
  }

  async deleteUser(user: User) {}

  async getUser(query: FilterQuery<User>) {}
}
