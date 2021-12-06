import { Module } from "@nestjs/common";
import { BookCaseDbService } from "./services/book-case.db.service";
import { BookDbService } from "./services/book.db.service";
import { LogEntryDbService } from "./services/log-entry.db.service";
import { UserDbService } from "./services/user.db.service";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { Book } from "./schemas/Book";
import { BookCase } from "./schemas/BookCase";
import { User } from "./schemas/User";
import { LogEntry } from "./schemas/LogEntry";


@Module({
  imports: [TypegooseModule.forFeature([Book, BookCase, User, LogEntry])],
  providers: [BookCaseDbService, BookDbService, UserDbService, LogEntryDbService],
  exports: [BookCaseDbService, BookDbService, UserDbService, LogEntryDbService]
})
export class DatabaseModule {
}
