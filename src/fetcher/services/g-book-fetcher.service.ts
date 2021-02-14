import { CACHE_MANAGER, HttpService, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { GoogleBook } from "../entities/GoogleBook";
import axios from "axios"
const credentials = require('./../../credentials.json');


//TODO: Cachen session-übergreifend gestalten, sodass nach einem Restart die Requests immer noch gecached sind
@Injectable()
export class GBookFetcherService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private httpService: HttpService) {}

    async getBookInformations(ids: string[]): Promise<GoogleBook[]> {
      let cache = this.checkIfInCache(ids)
      let promises: Promise<any>[] = []
      ids.forEach(e => {
        promises.push(this.httpService.get(`https://www.googleapis.com/books/v1/volumes/${e}?key=${credentials.api_key}`).toPromise())
      })
      return await axios.all(promises).then(axios.spread((...responses) => {
        let books: GoogleBook[] = []
        for(let i in cache){
          if(cache[i] == undefined){
            books.push(responses[i].data)
            this.cacheManager.set(responses[i].data.id, responses[i].data, { ttl: 10080 })
          }
        }
        return books
      }))
     //   this.httpService.axiosRef.all(`https://www.googleapis.com/books/v1/volumes/${id}?key=${credentials.api_key}`).toPromise().then(res => {return res.data})
    }

    checkIfInCache(ids: string[]): GoogleBook[] {
      let res = []
      ids.forEach((v, n) => {
        let c = this.cacheManager.get(v).then(value =>
          value == undefined ? res.push(null) : res.push(<GoogleBook>value)
        )
      })
      return res
    }
}

