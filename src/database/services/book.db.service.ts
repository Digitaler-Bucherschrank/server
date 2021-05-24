import { Injectable } from "@nestjs/common";
import { Book } from "../schemas/Book";
import { InjectModel } from "nestjs-typegoose";
import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { User } from "../schemas/User";
import { FilterQuery, ObjectId } from "mongoose";

@Injectable()
export class BookDbService {
  constructor(
    @InjectModel(Book) private readonly bookModel: ReturnModelType<typeof Book>
  ) {
  }

  getModel(): ReturnModelType<typeof Book> {
    return this.bookModel
  }

  async insertBook(book: Book): Promise<Book | boolean> {
    const gg = new this.bookModel(book)
    return new Promise(function(fulfil, reject) {
      gg.save({ validateBeforeSave: true }, (err, res) => {
        if (err) {
          fulfil(false);
        } else {
          fulfil(gg);
        }
      });
    })
  }
  
  async deleteBook(book: DocumentType<Book>): Promise<boolean> {
    return new Promise(function(fulfil, reject) {
      book.deleteOne(null, (err, res) => {
        fulfil(!err);
      });
    })
  }

  async findBooks(query: FilterQuery<User>, limit: number): Promise<Book[]> {
    const bookM = this.bookModel;
    return new Promise(function(fulfil, reject) {
      bookM.find(query).limit(limit).exec().then( (res) => {
          if(res){
            fulfil(res)
          } else {
            fulfil (null)
          }
        }
      )
    })
  }

  async findBook(query: FilterQuery<User>): Promise<Book> {
    const bookM = this.bookModel;
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