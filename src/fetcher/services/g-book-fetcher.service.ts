import { CACHE_MANAGER, HttpService, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { GoogleBook } from "../entities/GoogleBook";
import axios from "axios"
const credentials = require('../../credentials');

//TODO: Bücher mit ISBN suchen lassen
@Injectable()
export class GBookFetcherService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private httpService: HttpService) {}

    async getBookInformation(ids: string[]): Promise<GoogleBook[]> {
      let cache: GoogleBook[] = await this.checkIfInCache(ids)
      let promises: Promise<any>[] = []
      ids.forEach((e, i) => {
          if(cache[i] == undefined){
            promises.push(this.httpService.get(`https://www.googleapis.com/books/v1/volumes/${e}?key=${credentials.api_key}`).toPromise())
          }
      })
      return await axios.all(promises).then(axios.spread(async (...responses) => {
        let index = 0
        for(let i in cache){
          if(cache[i] == null){
            cache[i] = responses[index].data
            await this.cacheManager.set(responses[index].data.id, responses[index].data)
            index++
          }
        }
        return cache
      }))
    }

    async checkIfInCache(ids: string[]): Promise<GoogleBook[]> {
      let res = []
      for (const v of ids) {
        await this.cacheManager.get(v).then(value =>
          value == undefined ? res.push(null) : res.push(<GoogleBook>value)
        )
      }
      return res
    }
}

