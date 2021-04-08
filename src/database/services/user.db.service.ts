import { EntityManager, EntityRepository, FilterQuery } from "@mikro-orm/core";
import { Injectable, Scope } from "@nestjs/common";
import { User } from "../entities/User";

@Injectable()
/**
 * Instance to communicate with the User collection in our database
 */

// TODO: auf andere Klassen auch übertragen
@Injectable({ scope: Scope.TRANSIENT })
export class UserDbService {
  userRepository: EntityRepository<User> = this.em.fork(true, true).getRepository(User);

  constructor(
    private readonly em: EntityManager
  ) {
  }

  getUserRepository(): EntityRepository<User> {
    return this.userRepository;
  }

  async insertUser(user: User): Promise<boolean> {
    return this.userRepository.persistAndFlush(user).then(res => { return res == undefined})
  }

  async deleteUser(user: User) {}

  //TODO: Implement all User-related database operations to implement authentication
  // 1. implement getUser() function
  // 2. finish UsersService
  // 3. implement authentication strategy
  async getUser(query: FilterQuery<User>) {
      return await this.userRepository.findOne(query)
  }
}
