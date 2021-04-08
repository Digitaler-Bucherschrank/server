import { Injectable, Scope } from "@nestjs/common";
import { BookCase } from "../entities/BookCase";
import { EntityManager, EntityRepository } from "@mikro-orm/core";

@Injectable({ scope: Scope.TRANSIENT })
export class BookCaseDbService {
  bookCaseRepository: EntityRepository<BookCase> = this.em.fork(true, true).getRepository(BookCase);

  constructor(
    private readonly em: EntityManager
  ) {
  }
}
