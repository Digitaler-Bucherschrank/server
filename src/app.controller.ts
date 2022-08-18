import { Controller, Get } from '@nestjs/common';
import { ISBNdbFetcherService } from './fetcher/services/ISBN-db-fetcher.service';
//import { GoogleBook } from "./fetcher/entities/GoogleBook";
import { ISBNdbBook } from './fetcher/entities/ISBNdbBook';
@Controller()
export class AppController {
  constructor(private readonly fetcher: ISBNdbFetcherService) {}
}
