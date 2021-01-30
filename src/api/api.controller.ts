import { EntityManager, MikroORM } from '@mikro-orm/core';
import {Get, Injectable, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { BookCase } from 'src/entities/BookCase';

@Controller('api')
export class ApiController {
    constructor( private readonly orm: MikroORM,
                private readonly em: EntityManager) {

    }

    @Get()
    async addBookCase(): Promise<String> {
        var book = await this.em.getRepository(BookCase).find({address: "Hemmstraße 185"}).then((res) => console.log(res))
        return "gg"
    }
}
