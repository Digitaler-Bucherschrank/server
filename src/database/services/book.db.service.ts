import { EntityManager, EntityRepository, FilterQuery, MikroORM } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Book } from "../entities/Book";

@Injectable()
export class BookDbService {
  bookRepository: EntityRepository<Book> = this.em.getRepository(Book);

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  getBookRepository(): EntityRepository<Book> {
    return this.bookRepository
  }

  async insertBook(book: Book): Promise<boolean> {
    return this.bookRepository.persistAndFlush(book).then(res => {
      return res == undefined
    })
  }

  async deleteBook(book: Book) {
  }

  async updateBook(book: Book) {
  }

  async getBooks(query: FilterQuery<Book>): Promise<Book[]> {
    return await this.bookRepository.find(query) as Book[];
  }
}