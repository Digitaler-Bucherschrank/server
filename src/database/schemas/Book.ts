import { BookCase } from "./BookCase";
import { User } from "./User";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";

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

  @prop({ required: true })
  gbookid!: string;

  @prop({required:false})
  ISBN!: string;
  
  @prop({required:true})
  addedmanual!: boolean;

  @prop({required:true})
  borrowed!: boolean;
  
  @prop({required:true})
  author!: string;

  @prop({ required: true })
  title!: string;

  @prop({ ref: () => User, required: true })
  donor!: Ref<User>;

  @prop({ ref: () => BookCase, required: true })
  location!: Ref<BookCase>;

  @prop()
  createdAt!: Date;

  @prop()
  thumbnail!: string;

  @prop()
  updatedAt!: Date;
}