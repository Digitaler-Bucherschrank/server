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
import { info } from "node:console";
import { start } from "node:repl";
import { Types } from "mongoose";

@Controller("api")
// TODO: /return book book /searchbook (beschränkt)  //Problem with unknown ids!!

export class ApiController {
  constructor(private authService: AuthService,
     private readonly userdbService: UserDbService,
      private readonly fetcherService: GBookFetcherService,
       private readonly bookdbService: BookDbService,
       private readonly bookcasedbService: BookCaseDbService) {
  }

  @Post("signUp")
  async addUser(@Body() createUser: User, @Request() req: Request): Promise<boolean> {
    let res = await this.userdbService.insertUser(createUser);

    if(res){
      switch(res){
        case("successful"):{
          return true
        }
        // Check error messages in UserDBService
        default: {
          throw new HttpException(res, HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  @Get("searchBookbyAttribute") //problem with unknown book id!
  async searchBookbyAttribute(@Body() createBook: Body) {
    let res = await this.bookdbService.findBooks(createBook,20);
    if(isNullOrUndefined(res[0])==false) {
      return res
    } 
    else {
      throw new HttpException("book_not_found", HttpStatus.BAD_REQUEST);
    }
  }
  @Get("searchBookbyTitleorAuthor") //not 100% complete!!
  async searchBookbyTitleorAuthor(@Body() info) {
    let Book1 = new Book
    Book1.title = info.letters
    let Book2 = new Book
    Book2.author = info.letters
    return this.bookdbService.findBooks(Book1,1),this.bookdbService.findBooks(Book2,1);
  }

  @Get("searchBookCase") //problem with unknown bookcase id!
     async searchBookCase(@Body() createBookCase:BookCase) {
 
  
 if (Types.ObjectId.isValid(createBookCase._id)||isNullOrUndefined(createBookCase._id)==true) {
  let res = await this.bookcasedbService.findBookCases(createBookCase);
    if(isNullOrUndefined(res[0])==false) {
      return res
    } 
    else {
      throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);
    } 
  } else {
    throw new HttpException("non_valid_bookcase_id", HttpStatus.BAD_REQUEST);
  } }

@UseGuards(JwtAccessAuthGuard)
@Get("UserborrowedBooks") 
async UserborrowedBooks( @Request() req){
let user = new User
user._id=req.user
return (await this.userdbService.findUser(user)).borrowedBooks;
}
@UseGuards(JwtAccessAuthGuard)
@Get("UserdonatedBooks") 
async UserdonatedBooks( @Request() req){
let user = new User
user._id=req.user
return (await this.userdbService.findUser(user)).donatedBooks;
}
@Get("BookCaseInventory") //problem with unknown bookcase id!
async BookCaseInventory(@Body() createBookCase: BookCase){
if (Types.ObjectId.isValid(createBookCase._id)||isNullOrUndefined(createBookCase._id)==true) {
let res = await this.bookcasedbService.findBookCase(createBookCase)
if(isNullOrUndefined(res)==false) {
  return res.inventory
} 
else {
  throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);
}} else {
  throw new HttpException("non_valid_bookcase_id", HttpStatus.BAD_REQUEST);
}
}

  @UseGuards(JwtAccessAuthGuard) 
    @Post("donateBook") //problem with unknown book id!
  async donateBook(@Body() Info, @Request() req){
    let book = new Book ;
    let data = await this.fetcherService.getBookByISBN([Info.ISBN]);
    book.gbookid = data[0].id 
    book.ISBN = Info.ISBN
    book.author = data[0].volumeInfo.authors[0]
    book.title = data[0].volumeInfo.title
    book.subtitle = data[0].volumeInfo.subtitle
    
    
    //Solution may need further consideration
    if (isNullOrUndefined(data[0].volumeInfo.imageLinks)==false) {
      book.thumbnail=data[0].volumeInfo.imageLinks.thumbnail 
    }
    
    
    
    book.donor = req.user
    book.location = Info.location
    book.addedmanual = false
    book.borrowed = false
    if (Types.ObjectId.isValid(Info.location)){
    let res = await this.bookdbService.insertBook(book);
    let varbookcase = new BookCase;
    varbookcase._id = Info.location
    let bookcase = await this.bookcasedbService.findBookCase(varbookcase);
    
    if(!res){
      throw new HttpException("incomplete_book_data", HttpStatus.BAD_REQUEST);
    } else {
      if(!bookcase){throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);}
      else{
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
  }}else{
    throw new HttpException("non_valid_bookcase_id", HttpStatus.BAD_REQUEST);
  }}

  @UseGuards(JwtAccessAuthGuard)
  @Post("borrowBook") 
async borrowBook(@Body() Info, @Request() req){
  
  let book = new Book 
  let start;
  book._id = Info._id
  let bookc = await this.bookdbService.findBook(book)
  if(!bookc){
    throw new HttpException("error_book_not_found", HttpStatus.BAD_REQUEST); //needs further specification
  }

  let varbookcase = new BookCase;
    varbookcase._id = Info.location
  let bookcase = await this.bookcasedbService.findBookCase(varbookcase);
  
  if(!bookcase){
    throw new HttpException("error_already_borrowed", HttpStatus.BAD_REQUEST); //needs further specification
  } else {
    for (let index = 0; index < bookcase.inventory.length; index++) {
      if (bookc._id.equals(bookcase.inventory[index].toString()) ){

        
        start = index
        
        }
        } 
        if (isNullOrUndefined(start)==true) {
          throw new HttpException("book.location_does_not_match_real_location", HttpStatus.BAD_REQUEST); //further definition
        }
      else{
      (bookcase as DocumentType<BookCase>).inventory.splice(start , 1);
      (req.user as DocumentType<User>).borrowedBooks.push(<Book>bookc);
      (bookc as DocumentType<Book>).update(bookc.location=req.user._id);
      return new Promise(function(fulfil, reject) {
      (bookcase as DocumentType<BookCase>).save(null, (err, res) => {
        if(err){
          fulfil(false)
        } else {
          
            (req.user as DocumentType<User>).save(null, (err, res) => {
              if(err){
                fulfil(false)
              } else {
                (bookc as DocumentType<Book>).save(null, (err, res) => {
                  if(err){
                    fulfil(false)
                  } else {
                    fulfil(true)
                  }
                  });
            }});
        }
      });
    }) 
  }

}
}

@UseGuards(JwtAccessAuthGuard)
@Post("returnBook") 
async returnBook(@Body() Info, @Request() req){
let book = new Book 
let start;
book._id = Info._id
let bookc = await this.bookdbService.findBook(book)
let varbookcase = new BookCase;
varbookcase._id = Info.location
let bookcase = await this.bookcasedbService.findBookCase(varbookcase)
if(!bookcase){
  throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);
}
else{
if(!bookc){
  throw new HttpException("error_book_not_found", HttpStatus.BAD_REQUEST); //needs further specification
}

let user = await this.userdbService.findUser(bookc.location)
if(!user){
  throw new HttpException("error_already_returned", HttpStatus.BAD_REQUEST); //needs further specification
} else {
  if (user=req.user) {
  for (let index = 0; index < user.borrowedBooks.length; index++) {
    if (bookc._id.equals(user.borrowedBooks[index].toString()) ){

      
      start = index
      
      }
      } 
      if (isNullOrUndefined(start)==true) {
        throw new HttpException("book.location_does_not_match_real_location", HttpStatus.BAD_REQUEST); //further definition
      }
    else{
    (bookcase as DocumentType<BookCase>).inventory.push(<Book>bookc);
    (req.user as DocumentType<User>).borrowedBooks.splice(start , 1);
    (bookc as DocumentType<Book>).update(bookc.location=bookcase._id);
    return new Promise(function(fulfil, reject) {
    (bookcase as DocumentType<BookCase>).save(null, (err, res) => {
      if(err){
        fulfil(false)
      } else {
        
          (req.user as DocumentType<User>).save(null, (err, res) => {
            if(err){
              fulfil(false)
            } else {
              (bookc as DocumentType<Book>).save(null, (err, res) => {
                if(err){
                  fulfil(false)
                } else {
                  fulfil(true)
                }
                });
          }});
      }
    });
  }) 
}} else{
  throw new HttpException("book_is_not_in_user_inventory", HttpStatus.BAD_REQUEST);
}}

}
}
  @UseGuards(JwtAccessAuthGuard)
    @Post("donateBookmanual") 
  async donateBookmanual(@Body() createBook, @Request() req){ 
    createBook.donor = req.user
    createBook.addedmanual = true
    createBook.borrowed = false
    if (Types.ObjectId.isValid(createBook.location)){
      let res = await this.bookdbService.insertBook(createBook);
      let varbookcase = new BookCase;
      varbookcase._id = createBook.location
      let bookcase = await this.bookcasedbService.findBookCase(varbookcase);
      
      if(!res){
        throw new HttpException("incomplete_book_data", HttpStatus.BAD_REQUEST);
      } else {
        if(!bookcase){throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);}
        else{
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
    }}else{
      throw new HttpException("non_valid_bookcase_id", HttpStatus.BAD_REQUEST);
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
@Get('searchBookbyGbookid')
async searchBookbyGbookid(@Body() Gbookid) {
 let res = await this.fetcherService.getBookInformation([Gbookid.Gbookid]);
 return res[0];
}
  @UseGuards(JwtAccessAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }


}
