import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ApiController } from './api.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ApiController],
    providers: [],
})
export class ApiModule {}
