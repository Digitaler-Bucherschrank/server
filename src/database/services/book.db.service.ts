import { EntityManager, EntityRepository, FilterQuery } from "@mikro-orm/core";
import { Injectable, Scope } from "@nestjs/common";
import { Book } from "../entities/Book";

@Injectable({ scope: Scope.TRANSIENT })
export class BookDbService {
  constructor(
    private readonly em: EntityManager
  ) {
  }

  bookRepository: EntityRepository<Book> = this.em.fork(true, true).getRepository(Book);


  getBookRepository(): EntityRepository<Book> {
    return this.bookRepository;
  }

  async insertBook(book: Book): Promise<boolean> {
    return this.bookRepository.persistAndFlush(book).then(res => {
      return res == undefined;
    });
  }

  async deleteBook(book: Book) {
  }

  async updateBook(book: Book) {
  }

  async getBooks(query: FilterQuery<Book>): Promise<Book[]> {
    return await this.bookRepository.find(query) as Book[];
  }
}