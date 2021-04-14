import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { UserDbService } from "../database/services/user.db.service";
import { BookDbService } from "../database/services/book.db.service";
import { BookCaseDbService } from "../database/services/book-case.db.service";
import { Book } from "src/database/schemas/Book";
import { User } from "src/database/schemas/User";
import { GBookFetcherService } from "../fetcher/services/g-book-fetcher.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../auth/auth.service";
import { JwtRefreshAuthGuard } from "../auth/guards/jwtrefresh.guard";
import { JwtAccessAuthGuard } from "../auth/guards/jwtaccess.guard";
import { DocumentType } from "@typegoose/typegoose";
import { title } from "node:process";
import { identity } from "rxjs";
import { BookCase } from "src/database/schemas/BookCase";
import { isNullOrUndefined } from "@typegoose/typegoose/lib/internal/utils";

@Controller("api")
// TODO: /borrowbook /searchBookbyGbookid finish /searchbyISBN complete /getbookcaseinventory /getuserinventory /addbook complete /searchbook (ersten ) complete

export class ApiController {
  constructor(private authService: AuthService,
     private readonly userdbService: UserDbService,
      private readonly fetcherService: GBookFetcherService,
       private readonly bookdbService: BookDbService,
       private readonly bookcasedbService: BookCaseDbService) {
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

  @Get("searchBookCase")
  async searchBookCase(@Body() createBookCase: Body) {
    return this.bookcasedbService.findBookCases(createBookCase);
  }
 
  @UseGuards(JwtAccessAuthGuard)
    @Post("donateBook") 
  async donateBook(@Body() Info, @Request() req){
    let book = new Book ;
    let data = await this.fetcherService.getBookByISBN([Info.ISBN]);
    book.gbookid = data[0].id 
    book.ISBN = Info.ISBN
    book.author = data[0].volumeInfo.authors[0]
    book.title = data[0].volumeInfo.title
    book.subtitle = data[0].volumeInfo.subtitle
  
    var thumbnail 
    //Lösung benötigt eventuell überarbeitung
    if (isNullOrUndefined(data[0].volumeInfo.imageLinks)==true) {
     thumbnail == null;
    }
    else {
      data[0].volumeInfo.imageLinks.thumbnail = thumbnail
    }
    book.thumbnail = thumbnail
    book.donor = req.user
    book.location = Info.location
    let res = await this.bookdbService.insertBook(book);
    let varbookcase = new BookCase;
    varbookcase._id = Info.location
    let bookcase = await this.bookcasedbService.findBookCase(varbookcase);
    
    if(!res){
      throw new HttpException("incomplete_book_data", HttpStatus.BAD_REQUEST);
    } else {
      (req.user as DocumentType<User>).donatedBooks.push(<Book>res);
      (bookcase as DocumentType<BookCase>).inventory.push(<Book>res);
      return new Promise(function(fulfil, reject) {
        (bookcase as DocumentType<BookCase>).save(null, (err, res) => {
          if(err){
            fulfil(false)
          } else {
            
              (req.user as DocumentType<User>).save(null, (err, res) => {
                if(err){
                  fulfil(false)
                } else {
                  fulfil(true)
                }
              });
          }
        });
      })
    }
  }
  //Just for testing:
  @Post("addBookCase")
  async addBookCase(@Body() createbookcase:BookCase, @Request() req): Promise<boolean> {
    
    let res = await this.bookcasedbService.insertBookCase(createbookcase);
    if(!res){
      throw new HttpException("incomplete_bookcase_data", HttpStatus.BAD_REQUEST);
    }
    else{return true}
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
  async searchBookbyISBN(@Body() ISBN) {
   let res = await this.fetcherService.getBookByISBN([ISBN.ISBN]);
   return res[0];
}
  @UseGuards(JwtAccessAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }


}
