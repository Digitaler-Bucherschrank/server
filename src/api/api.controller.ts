import { Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { Controller } from '@nestjs/common';
import { UserDbService } from "../database/services/user.db.service";
import { BookDbService } from "../database/services/book.db.service";
import { Book } from 'src/database/entities/Book';
import { User } from 'src/database/entities/User';
import { GBookFetcherService } from "../fetcher/services/g-book-fetcher.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth/auth.service";
import { JwtRefreshAuthGuard } from "../auth/guards/jwtrefresh.guard";
import { JwtAccessAuthGuard } from "../auth/guards/jwtaccess.guard";

@Controller('api')
// TODO: finish implementing Endpoints & individualized responses corresponding to the error (wrong password etc.)
export class ApiController {
  constructor(private authService: AuthService, private readonly userdbService: UserDbService, private readonly fetcherService: GBookFetcherService, private readonly bookdbService: BookDbService) {}

  //TODO: add Validation of User
  @Post('register')
  async addUser(@Body() createUser: User): Promise<boolean> {
    let res = this.userdbService.insertUser(this.userdbService.getUserRepository().create({
      username: createUser.username,
      mail: createUser.mail,
      passwordhash: createUser.hash,
      createdAt: new Date()
    }))

    return res

  }

  @Get('searchBook')
  async searchBook(@Body() createBook: Book) {
    return this.bookdbService.getBooks( {  gbookid: createBook.gbookid,
      donor: createBook.donor});
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('addBook')
  async addBook(@Body() createBook: Book): Promise<boolean> {
    let res = this.bookdbService.insertBook(this.bookdbService.getBookRepository().create({
      gbookid: createBook.gbookid,
      donor: createBook.donor,
      // location: "",
      createdAt: new Date()
    }))

    return res

  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async getRefreshToken(@Request() req){
    return await this.authService.refreshTokens(req.user)
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req){
    return await this.authService.login(req.user)
  }

  // TODO: Logout route ==> delete access/refresh token pair
}
