import { CacheModule, HttpModule } from "@nestjs/common";
import { Module } from '@nestjs/common';
import { GBookFetcherService } from './services/g-book-fetcher.service';

//TODO: Google Books API ansprechen und mithilfe des von NestJS zur Verfügung gestellten CacheManager die Requests cachen, sodass wir nicht immer die gleichen Bücher abfragen müssen
@Module({
    imports: [CacheModule.register(), HttpModule],
    providers: [GBookFetcherService],
    exports: [GBookFetcherService]
})
export class FetcherModule {}
