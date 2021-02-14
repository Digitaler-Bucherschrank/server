import { Module } from '@nestjs/common';
import { BookCaseDbService } from './services/book-case.db.service';
import { BookDbService } from './services/book.db.service';
import { LogEntryDbService } from './services/log-entry.db.service';
import { UserDbService } from './services/user.db.service';


@Module({
    providers: [BookCaseDbService, BookDbService, UserDbService, LogEntryDbService],
    exports: [BookCaseDbService, BookDbService, UserDbService, LogEntryDbService]
})
export class DatabaseModule {}
