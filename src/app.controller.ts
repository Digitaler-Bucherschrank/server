import { Controller, Get } from '@nestjs/common';
import { GBookFetcherService } from "./fetcher/services/g-book-fetcher.service";
import { GoogleBook } from "./fetcher/entities/GoogleBook";

@Controller()
export class AppController {
  constructor(private readonly fetcher: GBookFetcherService) {}

  @Get()
  async getHello(): Promise<GoogleBook[]> {
    return await this.fetcher.getBookInformation(["B8oNAQAAMAAJ", "f94S3a1SzvoC", "eGdoAAAAcAAJ", "uzr8NqDkfcQC", "sSaIAAAAQBAJ"]).then(res => {return res});
  }
}
