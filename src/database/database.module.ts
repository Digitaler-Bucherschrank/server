import { Module } from '@nestjs/common';
import { BookCaseService } from './services/book-case.service';
import { BookService } from './services/book.service';
import { LogEntryService } from './services/log-entry.service';
import { UserService } from './services/user.service';

@Module({
    providers: [BookCaseService, BookService, UserService, LogEntryService],
    exports: [BookCaseService, BookService, UserService, LogEntryService]
})
export class DatabaseModule {}
