import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {Cache} from "cache-manager";

//TODO: Methoden zum Abfragen adden (API-Key per DI) (Cachen nicht vergessen!)
@Injectable()
export class GBookFetcherService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
}
