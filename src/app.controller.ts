import { Controller, Get } from "@nestjs/common";
import { ISBNdbFetcherService } from "./fetcher/services/ISBN-db-fetcher.service";
//import { GoogleBook } from "./fetcher/entities/GoogleBook";
import { ISBNdbBook } from "./fetcher/entities/ISBNdbBook";
@Controller()
export class AppController {
  constructor(private readonly fetcher: ISBNdbFetcherService) {
  }

 /* @Get()
  async getHello(): Promise<ISBNdbBook[]> {
    return await this.fetcher.getBookByGBookID(["B8oNAQAAMAAJ", "f94S3a1SzvoC", "eGdoAAAAcAAJ", "uzr8NqDkfcQC", "sSaIAAAAQBAJ"]).then(res => {
      return res;
    });
  } */
}
