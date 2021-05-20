import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from "@nestjs/common";
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
import { DocumentType, mongoose } from "@typegoose/typegoose";
import { BookCase } from "src/database/schemas/BookCase";

const ObjectId = require("mongoose").Types.ObjectId;

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
}

@Controller("api")
export class ApiController {
  constructor(
    private authService: AuthService,
    private readonly userdbService: UserDbService,
    private readonly fetcherService: GBookFetcherService,
    private readonly bookdbService: BookDbService,
    private readonly bookcasedbService: BookCaseDbService
  ) {
  }


  @Post("signUp")
  async addUser(@Body() createUser: User, @Request() req: Request): Promise<boolean> {
    let res = await this.userdbService.insertUser(createUser);

    if (res) {
      switch (res) {
        case("successful"): {
          return true;
        }
        // Check error messages in UserDBService
        default: {
          throw new HttpException(res, HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get("searchBookCase")
  async searchBookCase(@Body() createBookCase: BookCase) {
    if (
      isValidObjectId(createBookCase._id) == false
    ) {
      throw new HttpException("invalid_bookcase_id", HttpStatus.BAD_REQUEST);
    }

    let res = await this.bookcasedbService.findBookCases(createBookCase);
    if (!res == null) {
      return res;
    } else {
      throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Returns the user's inventory, either donated/borrowed or both
   *
   * @param req
   * @param query
   */
  @UseGuards(JwtAccessAuthGuard)
  @Get("getUserInventory")
  async getUserInventory(@Request() req, @Body() query) {
    if(query.type == "donated"){
      return req.user.donatedBooks;
    } else if(query.type == "borrowed"){
      return req.user.borrowedBooks;
    } else {
      return {
        donated: req.user.donatedBooks,
        borrowed: req.user.borrowedBooks
      }
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get("bookCaseInventory")
  async bookCaseInventory(@Body() createBookCase: BookCase) {
    if (
      isValidObjectId(createBookCase._id) == false
    ) {
      throw new HttpException("invalid_bookcase_id", HttpStatus.BAD_REQUEST);
    }

    let res = await this.bookcasedbService.findBookCase(createBookCase);

    if (res) {
      return res.inventory;
    } else {
      throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Donate a book, pass type: "manual" if you want to donate a book with custom data
   * @param body
   * @param req
   */
  @UseGuards(JwtAccessAuthGuard)
  @Post("donateBook") //needs ISBN and location
  async donateBook(@Body() body, @Request() req) {
    let book = new Book();
    if(body.type == "manual"){
      let data = await this.fetcherService.getBookByISBN([body.ISBN]);
      book.gbookid = data[0].id;
      book.ISBN = body.ISBN;
      book.author = data[0].volumeInfo.authors[0];
      book.title = data[0].volumeInfo.title;
      book.thumbnail = data[0].volumeInfo.imageLinks?.thumbnail;

      book.donor = req.user;
      book.location = body.location;
      book.addedmanual = false;
    } else {
       book = Book.createBook(body.book)
       book.addedmanual = true;
    }

    let bookcase = await this.bookcasedbService.findBookCase({
      location: new mongoose.Types.ObjectId(body.location) ?? ""
    });

    if (!bookcase) {
      throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);
    }

    let res = await this.bookdbService.insertBook(book);

    if (!res) {
      throw new HttpException("incomplete_book_data", HttpStatus.BAD_REQUEST);
    }

    await (req.user as DocumentType<User>).db.transaction(async (session) => {
      req.user.donatedBooks.push(<Book>res).s;
      bookcase.inventory.push(<Book>res);

      await (bookcase as DocumentType<BookCase>).save();
      await (req.user as DocumentType<User>).save();
    }).catch(err => {
      throw new HttpException("internal_error", HttpStatus.INTERNAL_SERVER_ERROR);
    }).then(() => {
      return true;
    });
  }

  /**
   * Borrows a book by a user
   * @param body ```bookId``` and ```bookcaseId``` needed for information
   * @param req
   */
  @UseGuards(JwtAccessAuthGuard)
  @Post("borrowBook")
  async borrowBook(@Body() body, @Request() req) {
    if (isValidObjectId(body.bookId) == false) {
      throw new HttpException("invalid_book_id", HttpStatus.BAD_REQUEST);
    } else if(isValidObjectId(body.bookcaseId) == false){
      throw new HttpException("invalid_bookcase_id", HttpStatus.BAD_REQUEST);
    } else {

      let book = await this.bookdbService.findBook({ _id: new mongoose.Types.ObjectId(body.bookId) });

      if (!book) throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);

      let bookcase = await this.bookcasedbService.findBookCase({ _id: new mongoose.Types.ObjectId(body.bookcaseId) });

      if (!bookcase) throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);

      if (book.location == bookcase._id) {
        if (book.borrowed == true) {
          throw new HttpException(
            "error_already_borrowed",
            HttpStatus.BAD_REQUEST
          ); //needs further specification
        }

        await (req.user as DocumentType<User>).db.transaction(async (session) => {
          let ind = bookcase.inventory.findIndex(bookCase => bookCase == book.location);
          if (ind == -1) {
            throw new HttpException("internal_error", HttpStatus.INTERNAL_SERVER_ERROR); //further definition
          }

          // TODO: fix up that shit
          bookcase.inventory = bookcase.inventory.splice(ind, 1);
          (req.user as DocumentType<User>).borrowedBooks.push(<Book>book);

          book.location = req.user._id;
          book.borrowed = true;

          await (req.user as DocumentType<User>).save();
          await (book as DocumentType<Book>).save();
          await (bookcase as DocumentType<BookCase>).save();
        }).
        catch(err => {
          throw new HttpException("internal_error", HttpStatus.INTERNAL_SERVER_ERROR);
        });

    } else {
        throw new HttpException(
          "book_not_in_bookcase",
          HttpStatus.BAD_REQUEST
        ); //needs further specification
      }
    }
  }

  /**
   * Returns a book from a user
   * @param body ```bookId``` and ```bookcaseId``` needed for information
   * @param req
   */
  @UseGuards(JwtAccessAuthGuard)
  @Post("returnBook") //needs book_id, location
  async returnBook(@Body() body, @Request() req) {
    if (isValidObjectId(body.bookId) == false) {
      throw new HttpException("invalid_book_id", HttpStatus.BAD_REQUEST);
    } else if(isValidObjectId(body.bookcaseId) == false){
      throw new HttpException("invalid_bookcase_id", HttpStatus.BAD_REQUEST);
    } else {

      let book = await this.bookdbService.findBook({ _id: new mongoose.Types.ObjectId(body.bookId) });

      if (!book) throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);

      let bookcase = await this.bookcasedbService.findBookCase({ _id: new mongoose.Types.ObjectId(body.bookcaseId) });

      if (!bookcase) throw new HttpException("bookcase_not_found", HttpStatus.BAD_REQUEST);

      if(book.location != req.user._id){
        throw new HttpException("not_borrowed_by_user", HttpStatus.BAD_REQUEST);
      }

      await (req.user as DocumentType<User>).db.transaction(async (session) => {
        (bookcase as DocumentType<BookCase>).inventory.push(<Book>book);
        (req.user as DocumentType<User>).borrowedBooks.filter(borrowedBook => book._id != borrowedBook);

        book.location = bookcase._id;
        book.borrowed = false;

        await (req.user as DocumentType<User>).save();
        await (book as DocumentType<Book>).save();
        await (bookcase as DocumentType<BookCase>).save();
      }).
      catch(() => {
        throw new HttpException("internal_error", HttpStatus.INTERNAL_SERVER_ERROR);
      });
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

  // TODO: add search by attributes as Author or Title when needed
  @UseGuards(JwtAccessAuthGuard)
  @Get("searchBook")
  async searchBook(@Body() query) {
    if(query.gbookid != null){
      return await this.fetcherService.getBookByGBookID([query.isbn]);
    } else if(query.isbn != null) {
      return await this.fetcherService.getBookByISBN([query.isbn]);
    } else {
      throw new BadRequestException(null, "invalid_search_query")
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }
}
