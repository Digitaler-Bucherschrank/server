import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Get, Query, Post, Body, Put, Param, Delete, Req } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { BookCase } from 'src/database/entities/BookCase';
import { UserDbService } from "../database/services/user.db.service";
import { BookDbService } from "../database/services/book.db.service";
import { Request } from 'express';
import { Book } from 'src/database/entities/Book';
import { User } from 'src/database/entities/User';

@Controller('api')
// TODO: Add Endpoints
export class ApiController {
  constructor(private readonly userdbService: UserDbService, private readonly bookdbService: BookDbService) {}

  @Post('addUser')
  async addUser(@Body() createUser: User): Promise<boolean> {
    let res = this.userdbService.insertUser(this.userdbService.getUserRepository().create({
      username: createUser.username,
      mail: createUser.mail,
      passwordhash: createUser.passwordhash,
      createdAt: new Date()
    }))

    return res

  }
  /* @Get('updateUser')
   async updateUser(): Promise<boolean> {
     let res = this.userdbService.insertUser(this.userdbService.getUserRepository().create({
       username: "Nick",
       mail: "test@example.com",
       passwordhash: "12345678#",
       createdAt: new Date()
     }))
     return res

   }*/

  @Get('searchBook')
  async searchBook(@Body() createBook: Book) {
    return this.bookdbService.getBooks( {  gbookid: createBook.gbookid,
      donor: createBook.donor});



  }

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
  @Get('removeUser')
  async deleteUser() {
    let res = this.userdbService.deleteUser(this.userdbService.getUserRepository().create({
      _id: "601ea3cc0de0794b4442299d",
    }))

    return res

  }
}
