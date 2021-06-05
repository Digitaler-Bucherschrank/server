import { Controller, Get } from "@nestjs/common";
import { GBookFetcherService } from "./fetcher/services/g-book-fetcher.service";
import { GoogleBook } from "./fetcher/entities/GoogleBook";

@Controller()
export class AppController {
  constructor(private readonly fetcher: GBookFetcherService) {
  }
}
