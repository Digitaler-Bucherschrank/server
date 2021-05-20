import { CACHE_MANAGER, HttpService, Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Cache } from "cache-manager";
import { GoogleBook } from "../entities/GoogleBook";
import axios from "axios";
import { Config } from "../../config";
import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";

//TODO: Bücher mit ISBN suchen lassen
@Injectable()
export class GBookFetcherService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private httpService: HttpService) {
  }

  // Currently not needed as we only do caching by ISBN
  async getBookInformation(ids: string[]): Promise<GoogleBook[]> {
    let cache: GoogleBook[] = await this.checkIfInCache(ids);
    let promises: Promise<any>[] = [];
    ids.forEach((e, i) => {
      if (cache[i] == undefined) {
        promises.push(this.httpService.get(`https://www.googleapis.com/books/v1/volumes/${e}?key=${Config.api_key}`).toPromise());
      }
    });

    return await axios.all(promises).then(axios.spread(async (...responses) => {
      let index = 0;
      for (let i in cache) {
        if (cache[i] == null) {
          cache[i] = responses[index].data;
          await this.cacheManager.set(responses[index].data.id, responses[index].data);
          index++;
        }
      }
      return cache;
    }));
  }

  async checkIfInCache(ids: string[]): Promise<GoogleBook[]> {
    let res = [];
    for (const v of ids) {
      await this.cacheManager.get(v).then(value =>
        value == undefined ? res.push(null) : res.push(<GoogleBook>value)
      );
    }
    return res;
  }

  async getBookByISBN(ids: string[]): Promise<GoogleBook[]> {
    let cache: GoogleBook[] = await this.checkIfInCache(ids);
    let promises: Promise<any>[] = [];
    
    ids.forEach((e, i) => {
      if (cache[i] == undefined) {
        promises.push(this.httpService.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${e}`).toPromise());
        }
    });
   
    
    return await axios.all(promises).then(axios.spread(async (...responses) => {
      let index = 0;
      for (let i in cache) {
        if (cache[i] == null) {
          if (isNullOrUndefined(responses[index].data.items)) {
            throw new HttpException("no_book_found", HttpStatus.BAD_REQUEST);
          }
          
          cache[i] = responses[index].data.items[0];
          await this.cacheManager.set(responses[index].data.items[0].id, responses[index].data.items[0]);
          index++;
        }
      }
      return cache;
    }));
  }
}

