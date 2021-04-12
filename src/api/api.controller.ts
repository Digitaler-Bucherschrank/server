import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { UserDbService } from "../database/services/user.db.service";
import { BookDbService } from "../database/services/book.db.service";
import { Book } from "src/database/schemas/Book";
import { User } from "src/database/schemas/User";
import { GBookFetcherService } from "../fetcher/services/g-book-fetcher.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth/auth.service";
import { JwtRefreshAuthGuard } from "../auth/guards/jwtrefresh.guard";
import { JwtAccessAuthGuard } from "../auth/guards/jwtaccess.guard";

@Controller("api")
// TODO: finish implementing Endpoints & individualized responses corresponding to the error (wrong password etc.)
export class ApiController {
  constructor(private authService: AuthService,
     private readonly userdbService: UserDbService,
      private readonly fetcherService: GBookFetcherService,
       private readonly bookdbService: BookDbService) {
  }


  //TODO: add Validation of User
  @Post("register")
  async addUser(@Body() createUser: User): Promise<boolean> {
    let res = await this.userdbService.insertUser(createUser);

    if(res){
      return res
    } else {
      throw new HttpException("incomplete_user_data", HttpStatus.BAD_REQUEST);
    }

  }

  @Get("searchBook")
  async searchBook(@Body() createBook: Body) {
    return this.bookdbService.findBooks(createBook);
  }
 
  @UseGuards(JwtAccessAuthGuard)
  @Post("addBook")
  async addBook(@Body() createBook: Book): Promise<boolean> {
    let res = await this.bookdbService.insertBook(createBook);

    if(res){
      return res
    } else {
      throw new HttpException("incomplete_book_data", HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh")
  async getRefreshToken(@Request() req) {
    return await this.authService.refreshTokens(req.user);
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
  @UseGuards(JwtAccessAuthGuard)
  @Get('searchBookbyISBN')
  async searchBookbyISBN() {
   let res = await this.fetcherService.getBookByISBN(["%209783125781405"]);
    return res[0];
}
  @UseGuards(JwtAccessAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }
}
