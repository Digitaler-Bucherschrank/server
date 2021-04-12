import { Module } from "@nestjs/common";
import { BookCaseDbService } from "./services/book-case.db.service";
import { BookDbService } from "./services/book.db.service";
import { LogEntryDbService } from "./services/log-entry.db.service";
import { UserDbService } from "./services/user.db.service";
import { TypegooseModule } from "nestjs-typegoose";
import { Book } from "./entities/Book";
import { BookCase } from "./entities/BookCase";
import { User } from "./entities/User";
import { LogEntry } from "./entities/LogEntry";


@Module({
  imports: [TypegooseModule.forFeature([Book, BookCase, User, LogEntry])],
  providers: [BookCaseDbService, BookDbService, UserDbService, LogEntryDbService],
  exports: [BookCaseDbService, BookDbService, UserDbService, LogEntryDbService]
})
export class DatabaseModule {
}
