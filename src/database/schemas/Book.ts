import { BookCase } from "./BookCase";
import { User } from "./User";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { modelOptions, mongoose, plugin, prop, Ref } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";
import * as autopopulate from 'mongoose-autopopulate';

@plugin(autopopulate as any)
@modelOptions({ schemaOptions: { collection: "books", timestamps: true, validateBeforeSave: false } })
export class Book implements Base {

  public static createBook(bookDTO: Object): Book{
    let book = new Book();

    Object.keys(bookDTO).forEach(function(key,index) {
      book[key] = bookDTO[key]
    });

    return book
  }

  public _id: Types.ObjectId;
  public id: string;

  @prop({})
  manualBookData?: {
    description: string,

    publisher: string,

    publishedDate: string,

    language: string,
  };

  @prop({required:false})
  isbn!: string;
  
  @prop({required:true})
  addedmanual!: boolean;

  @prop({required:true, default: false})
  borrowed!: boolean;
  
  @prop({required:true})
  author!: string;

  @prop({ required: true})
  title!: string;

  @prop({ ref: () => User, required: true})
  donor!: Ref<User>;

  @prop({ ref: () => BookCase, required: true , autopopulate: { maxDepth: 1 }})
  location!: Ref<BookCase>;

  @prop()
  createdAt!: Date;

  @prop({default: "somedefaultthumb"})
  thumbnail!: string;

  @prop()
  updatedAt!: Date;
}
