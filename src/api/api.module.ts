import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ApiController } from './api.controller';
import { FetcherModule } from '../fetcher/fetcher.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, FetcherModule, AuthModule],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
