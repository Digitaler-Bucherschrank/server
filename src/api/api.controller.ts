import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Get, Injectable, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { BookCase } from 'src/database/entities/BookCase';
import { UserDbService } from "../database/services/user.db.service";

@Controller('api')
// TODO: Add Endpoints
export class ApiController {
  constructor(private readonly userdbService: UserDbService) {}

  @Get('adduser')
  async addUser(): Promise<boolean> {
    let res = this.userdbService.insertUser(this.userdbService.getUserRepository().create({
      username: "Nick",
      mail: "test@example.com",
      passwordhash: "hashkuchen",
      createdAt: new Date()
    }))

    return res
  }

  @Post('login')
  async login(): Promise<boolean> {
    return true
  }
}
