import {
  CACHE_MANAGER,
  HttpService,
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ISBNdbBook } from '../entities/ISBNdbBook';
import axios from 'axios';

//TODO: Bücher mit ISBN suchen lassen
@Injectable()
export class ISBNdbFetcherService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  // Currently not needed as we only do caching by ISBN
  /* async getBookByGBookID(ids: string[]): Promise<GoogleBook[]> {
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
  } */

  async checkIfInCache(ids: string[]): Promise<ISBNdbBook[]> {
    const res = [];
    for (const v of ids) {
      await this.cacheManager
        .get(v)
        .then((value) =>
          value == undefined ? res.push(null) : res.push(<ISBNdbBook>value),
        );
    }
    return res;
  }

  /* async getBookByISBN(ids: string[]): Promise<GoogleBook[]> {
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
          if (responses[index].data.items == null) {
            throw new HttpException("no_book_found", HttpStatus.BAD_REQUEST);
          }
          
          cache[i] = responses[index].data.items[0];
          await this.cacheManager.set(responses[index].data.items[0].id, responses[index].data.items[0]);
          index++;
        }
      }
      return cache;
    }));
  } */

  async getBookByISBN(ids: string[]): Promise<ISBNdbBook[]> {
    const cache: ISBNdbBook[] = await this.checkIfInCache(ids);
    const promises: Promise<any>[] = [];
    const headers = {
      'Content-Type': 'application/json',
      Authorization: process.env.API_KEY,
    };

    for (const e of ids) {
      const i = ids.indexOf(e);
      if (cache[i] == undefined) {
        promises.push(
          this.httpService
            .get(
              `https://api2.isbndb.com/book/${e}`,

              { headers: headers },
            )
            .toPromise(),
        );
      }
    }

    return await axios.all(promises).then(
      axios.spread(async (...responses) => {
        console.log(responses);
        let index = 0;
        for (const i in cache) {
          if (cache[i] == null) {
            if (responses[index].data.book == null) {
              throw new HttpException('no_book_found', HttpStatus.BAD_REQUEST);
            }

            cache[i] = responses[index].data.book;
            await this.cacheManager.set(
              responses[index].data.book.isbn13,
              responses[index].data.book,
            );
            index++;
          }
        }
        return cache;
      }),
    );
  }
}
