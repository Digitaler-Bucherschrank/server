import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';


@Module({
    controllers: [],
    providers: [DatabaseService],
})
export class DatabaseModule {}
