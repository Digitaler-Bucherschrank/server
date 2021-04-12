import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { BookCase } from "../entities/BookCase";
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { FilterQuery } from "mongoose";
import { User } from "../entities/User";

@Injectable()
export class BookCaseDbService {
  constructor(
    @InjectModel(BookCase) private readonly bookCaseModel: ReturnModelType<typeof BookCase>
  ) {
  }

  async insertBookCase(bookCase: BookCase): Promise<boolean> {
    const gg = new this.bookCaseModel(bookCase)
    return new Promise(function(fulfil, reject) {
      gg.save(null, (err, res) => {
        if(err){
          throw new HttpException("incomplete_data", HttpStatus.BAD_REQUEST);
        } else {
          fulfil(true)
        }
      });
    })
  }

  async deleteBookCase(bookCase: DocumentType<BookCase>): Promise<boolean> {
    return new Promise(function(fulfil, reject) {
      bookCase.deleteOne(null, (err, res) => {
        fulfil(!err);
      });
    })
  }

  async findBookCases(query: FilterQuery<User>): Promise<BookCase[]> {
    const bookM = this.bookCaseModel;
    return new Promise(function(fulfil, reject) {
      bookM.find(query).exec().then( (res) => {
          if(res){
            fulfil(res)
          } else {
            fulfil(null)
          }
        }
      )
    })
  }

  async findBookCase(query: FilterQuery<User>): Promise<BookCase> {
    const bookM = this.bookCaseModel;
    return new Promise(function(fulfil, reject) {
      bookM.findOne(query).exec().then( (res) => {
          if(res){
            fulfil(res)
          } else {
            fulfil(null)
          }
        }
      )
    })
  }
}
