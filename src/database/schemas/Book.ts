import { BookCase } from "./BookCase";
import { User } from "./User";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { collection: "books", timestamps: true, validateBeforeSave: false } })
export class Book implements Base {

  public static createBook(bookDTO: Object): User{
    let user = new User();

    Object.keys(bookDTO).forEach(function(key,index) {
      user[key] = bookDTO[key]
    });

    return user
  }

  _id: Types.ObjectId;
  id: string;

  @prop({ required: true })
  gbookid!: string;

  @prop({ required: true })
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
  thumbnail!: String;

  @prop()
  updatedAt!: Date;
}