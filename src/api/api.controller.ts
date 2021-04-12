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
import { DocumentType } from "@typegoose/typegoose";

@Controller("api")
// TODO: finish implementing Endpoints & individualized responses corresponding to the error (wrong password etc.)
export class ApiController {
  constructor(private authService: AuthService,
     private readonly userdbService: UserDbService,
      private readonly fetcherService: GBookFetcherService,
       private readonly bookdbService: BookDbService) {
  }


  @UseGuards(JwtAccessAuthGuard)
  @Get('searchBookByISBN')
  async searchBookByISBN() {
    return this.fetcherService.getBookByISBN(["%209783125781405"]);
  }


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
  async addBook(@Body() createBook: Book, @Request() req): Promise<boolean> {
    createBook.donor = req.user

    let res = await this.bookdbService.insertBook(createBook);

    if(!res){
      throw new HttpException("incomplete_book_data", HttpStatus.BAD_REQUEST);
    } else {
      (req.user as DocumentType<User>).donatedBooks.push(<Book>res);
      return new Promise(function(fulfil, reject) {
        (req.user as DocumentType<User>).save(null, (err, res) => {
          if(err){
            fulfil(false)
          } else {
            fulfil(true)
          }
        });
      })
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
