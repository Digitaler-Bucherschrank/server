import { CacheModule, HttpModule, Module } from "@nestjs/common";
import { GBookFetcherService } from "./services/g-book-fetcher.service";

import * as fsStore from "cache-manager-fs-hash";

//TODO: Google Books API ansprechen und mithilfe des von NestJS zur Verfügung gestellten CacheManager die Requests cachen, sodass wir nicht immer die gleichen Bücher abfragen müssen
@Module({
  imports: [CacheModule.register(
    {
      store: fsStore,
      ttl: 60 * 60 * 24,
      options: {
        maxsize: 1000 * 1000 * 1000/* 1 GB Cache size */, path: "api_cache"
      }
    }
  ), HttpModule],
  providers: [GBookFetcherService],
  exports: [GBookFetcherService]
})
export class FetcherModule {
}
