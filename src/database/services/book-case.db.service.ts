import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@m8a/nestjs-typegoose";
import { BookCase } from "../schemas/BookCase";
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { FilterQuery } from "mongoose";
import { User } from "../schemas/User";

@Injectable()
export class BookCaseDbService {
  constructor(
    @InjectModel(BookCase) private readonly bookCaseModel: ReturnModelType<typeof BookCase>
  ) {
  }

  async insertBookCase(bookCase: BookCase): Promise<boolean> {
    const gg = new this.bookCaseModel(bookCase)
    return new Promise(function(fulfil, reject) {
      gg.save({ validateBeforeSave: true }, (err, res) => {
        if (err) {
          throw new HttpException("incomplete_data", HttpStatus.BAD_REQUEST);
        } else {
          fulfil(true);
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

  async findBookCases(query: FilterQuery<DocumentType<BookCase>>): Promise<BookCase[]> {
    const bookM = this.bookCaseModel;
    return new Promise(function(fulfil, reject) {
      bookM.find(query).exec((err, res) => {
        if(err){
          fulfil(res)
        } else {
          fulfil(null)
        }
      })
    })
  }

  async findBookCaseByID(id: String): Promise<BookCase> {
    const bookM = this.bookCaseModel;
    return new Promise(function(fulfil, reject) {
      bookM.findById(id).exec().then( (res) => {
          if(res){
            fulfil(res)
          } else {
            fulfil(null)
          }
        }
      )
    })
  }

  async findBookCase(query: FilterQuery<DocumentType<BookCase>>): Promise<BookCase> {
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

  async findBookCasebyID(id: String): Promise<BookCase> {
    const bookM = this.bookCaseModel;
    return new Promise(function(fulfil, reject) {
      bookM.findById(id).exec().then( (res) => {
          if(res){
            fulfil(res)
          } else {
            fulfil(null)
          }
        }
      )
    })
  }

    async updateBookCase(bookcase: DocumentType<BookCase>): Promise<boolean>{
      return new Promise(function(fulfil, reject) {
        bookcase.save(null, (err, res) => {
          if (err) {
            fulfil(false);
          } else {
            fulfil(true)
          }
        });
    })
  }
}
