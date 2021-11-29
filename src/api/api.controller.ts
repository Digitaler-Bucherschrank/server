import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserDbService } from '../database/services/user.db.service';
import { BookDbService } from '../database/services/book.db.service';
import { BookCaseDbService } from '../database/services/book-case.db.service';
import { Book } from 'src/database/schemas/Book';
import { User } from 'src/database/schemas/User';
import { ISBNdbFetcherService } from '../fetcher/services/ISBN-db-fetcher.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { JwtRefreshAuthGuard } from '../auth/guards/jwtrefresh.guard';
import { JwtAccessAuthGuard } from '../auth/guards/jwtaccess.guard';
import { DocumentType, mongoose } from '@typegoose/typegoose';
import { BookCase } from 'src/database/schemas/BookCase';
import * as fs from "fs";
import path from "node:path";

const ObjectId = require('mongoose').Types.ObjectId;

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
}

@Controller('api')
export class ApiController {
  constructor(
    private authService: AuthService,
    private readonly userdbService: UserDbService,
    private readonly fetcherService: ISBNdbFetcherService,
    private readonly bookdbService: BookDbService,
    private readonly bookcasedbService: BookCaseDbService,
  ) {}

  @Post('signUp')
  async addUser(
    @Body() createUser: User,
    @Request() req: Request,
  ): Promise<boolean> {
    let res = await this.userdbService.insertUser(createUser);

    if (res) {
      switch (res) {
        case 'successful': {
          return true;
        }
        // Check error messages in UserDBService
        default: {
          throw new HttpException(res, HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  // Temporary, maybe provides in the future more information to the client; right now just dummy endpoint for the Client checking if the server is up
  @Get('getStatus')
  async getStatus(
    @Request() req
  ) {
      return {}
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('getBookCase')
  async searchBookCase(
    @Query('_id') id: string,
    @Query('type') type: string,
    @Request() req,
  ) {
    if (isValidObjectId(id) == false) {
      throw new HttpException('invalid_bookcase_id', HttpStatus.BAD_REQUEST);
    }

    let res = await this.bookcasedbService.findBookCaseByID(id);

    if (res != null) {
      if ((type ?? '') == 'inventory') {
        return res.inventory;
      } else {
        return res;
      }
    } else {
      throw new HttpException('bookcase_not_found', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Returns the user's inventory, either donated/borrowed or both
   *
   * @param req
   * @param query
   */
  @UseGuards(JwtAccessAuthGuard)
  @Get('getUserInventory')
  async getUserInventory(@Request() req, @Body() query) {
    if (query.type == 'donated') {
      return req.user.donatedBooks;
    } else if (query.type == 'borrowed') {
      return req.user.borrowedBooks;
    } else {
      return {
        donated: req.user.donatedBooks,
        borrowed: req.user.borrowedBooks,
      };
    }
  }

  /**
   * Donate a book, pass type: "manual" if you want to donate a book with custom data
   * @param body
   * @param req
   */
  @UseGuards(JwtAccessAuthGuard)
  @Post('donateBook') //needs ISBN and location
  async donateBook(@Body() body, @Request() req) {
    let book = new Book();
    if (body.type != 'manual') {
      let data = await this.fetcherService.getBookByISBN([body.isbn]);
      book.isbn = data[0].isbn13
      book.author = data[0].authors[0] ?? "-";
      book.title = data[0].title;
      book.thumbnail = data[0].image;
      
      book.donor = req.user;
      book.location = body.location;
      book.currentUser = null;
      book.addedmanual = false;
  
    } else {
      book = new (this.bookdbService.getModel())(JSON.parse(body.book));

      book.donor = req.user;
      book.location = body.location;
      book.currentUser = null;
      book.addedmanual = true;
      
    }

    let bookcase = await this.bookcasedbService.findBookCasebyID(body.location);

    if (!bookcase) {
      throw new HttpException('bookcase_not_found', HttpStatus.BAD_REQUEST);
    }

    await (req.user as DocumentType<User>).db
      .transaction(async (session) => {
        let res = await this.bookdbService.insertBook(book);

        if (!res) {
          throw new HttpException(
            'incomplete_book_data',
            HttpStatus.BAD_REQUEST,
          );
        }

        req.user.donatedBooks.push(<Book>res);
        bookcase.inventory.push(<Book>res);

        await (bookcase as DocumentType<BookCase>).save();
        await (req.user as DocumentType<User>).save();
      })
      .catch((err) => {
        if (err instanceof HttpException) {
          throw err;
        } else {
          throw new HttpException(
            'internal_error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      })
      .then(() => {
        return true;
      });
  }

  /**
   * Borrows a book by a user
   * @param body ```bookId``` and ```location``` needed for information
   * @param req
   */
  @UseGuards(JwtAccessAuthGuard)
  @Post('borrowBook')
  async borrowBook(@Body() body, @Request() req) {
    
    if (isValidObjectId(body.bookId) == false) {
      throw new HttpException('invalid_book_id', HttpStatus.BAD_REQUEST);
    } else if (isValidObjectId(body.location) == false) {
      throw new HttpException('invalid_bookcase_id', HttpStatus.BAD_REQUEST);
    } else {
      let book = await this.bookdbService.findBook({
        _id: new mongoose.Types.ObjectId(body.bookId),
      });

      if (!book) {
        throw new HttpException('book_not_found', HttpStatus.BAD_REQUEST);
    }
    if (book.borrowed == true) {
      throw new HttpException(
        'error_already_borrowed',
        HttpStatus.BAD_REQUEST,
      ); //needs further specification
    }
      let bookcase = await this.bookcasedbService.findBookCase({
        _id: new mongoose.Types.ObjectId(body.location),
      });

      if (!bookcase)
        throw new HttpException('bookcase_not_found', HttpStatus.BAD_REQUEST);

      if (bookcase._id.equals((book.location as BookCase)._id)) {
        // Double Failsafe
        

        await (req.user as DocumentType<User>).db
          .transaction(async (session) => {
            let ind = bookcase.inventory.findIndex((InvBook) =>
              (InvBook as DocumentType<Book>).equals(
                book as DocumentType<Book>,
              ),
            );
            if (ind == -1) {
              throw new HttpException(
                'internal_error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ); //further definition
            }

            bookcase.inventory.splice(ind, 1);
            (req.user as DocumentType<User>).borrowedBooks.push(<Book>book);
              
            book.currentUser = req.user._id;
            
            book.location = null;
            book.borrowed = true;

            await (req.user as DocumentType<User>).save();
            await (book as DocumentType<Book>).save();
            await (bookcase as DocumentType<BookCase>).save();
          })
          .catch((err) => {
            throw new HttpException(
              'internal_error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          })
          .then(() => {
            return true;
          });
      } else {
        throw new HttpException('book_not_in_bookcase', HttpStatus.BAD_REQUEST); //needs further specification
      }
    }
  }

  /**
   * Returns a book from a user
   * @param body ```bookId``` and ```location``` needed for information
   * @param req
   */
  @UseGuards(JwtAccessAuthGuard)
  @Post('returnBook') //needs book_id, location
  async returnBook(@Body() body, @Request() req) {
    if (isValidObjectId(body.bookId) == false) {
      throw new HttpException('invalid_book_id', HttpStatus.BAD_REQUEST);
    } else if (isValidObjectId(body.location) == false) {
      throw new HttpException('invalid_bookcase_id', HttpStatus.BAD_REQUEST);
    } else {
      let book = await this.bookdbService.findBook({
        _id: new mongoose.Types.ObjectId(body.bookId),
      });
   
      if (!book) {
        throw new HttpException('book_not_found', HttpStatus.BAD_REQUEST);
      }
      if (book.borrowed == false) {
        throw new HttpException(
          'error_already_returned',
          HttpStatus.BAD_REQUEST,
        ); //needs further specification
      }
      let bookcase = await this.bookcasedbService.findBookCase({
        _id: new mongoose.Types.ObjectId(body.location),
      });

      if (!bookcase)
        throw new HttpException('bookcase_not_found', HttpStatus.BAD_REQUEST);

    /*  if (book.currentUser.toString() != req.user._id.toString()) {
        throw new HttpException('not_borrowed_by_user', HttpStatus.BAD_REQUEST);
      } */

      await (req.user as DocumentType<User>).db
        .transaction(async (session) => {
          (bookcase as DocumentType<BookCase>).inventory.push(<Book>book);
          (req.user as DocumentType<User>).borrowedBooks = req.user.borrowedBooks.filter(
            (borrowedBook) => book._id.toString() != borrowedBook._id.toString(),
          );

          book.location = bookcase._id;
          book.currentUser =null;
          book.borrowed = false;

        await (req.user as DocumentType<User>).save();
        await (book as DocumentType<Book>).save();
        await (bookcase as DocumentType<BookCase>).save();
      }).
      catch(err => {
        throw new HttpException("internal_error", HttpStatus.INTERNAL_SERVER_ERROR);
      }).then(() => {
        return true;
      });
    }
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async getRefreshToken(@Request() req) {
    return await this.authService.refreshTokens(req.user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  // TODO: add search by attributes as Author or Title when needed
  @UseGuards(JwtAccessAuthGuard)
  @Get('getBookInfo')
  async searchBooks(@Query() query) {
    if (query.isbn != null) {
      let queryObj = JSON.parse(query.isbn);

      if(typeof queryObj[Symbol.iterator] === 'function'){
        return JSON.stringify(await this.fetcherService.getBookByISBN(queryObj));
      } else {
        throw new BadRequestException(null, 'invalid_search_query');
      }
    } else {
      throw new BadRequestException(null, 'invalid_search_query');
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('searchBooks')
  async searchBookdb(@Query() query) {
    if (query.query != null) {
      return await this.bookdbService.findBooks(
        { $or: [ { title: { $regex: query.query, $options: 'i' } }, { author: { $regex: query.query, $options: 'i' } } ] },
        5,
      );
    } else {
      throw new BadRequestException(null, 'invalid_search_query');
    }
  }
}
