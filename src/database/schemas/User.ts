import { Book } from "./Book";
import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import validator from "validator";

// TODO: optional custom error messages for validation
@modelOptions({ schemaOptions: { collection: "users", timestamps: true, validateBeforeSave: false } })
export class User implements Base {

  public static createUser(userDTO: Object): User{
    let user = new User();

    Object.keys(userDTO).forEach(function(key,index) {
      user[key] = userDTO[key]
    });

    return user
  }

  _id: Types.ObjectId;
  id: string;

  @prop({ unique: true , required: true, minlength: 6, maxlength: 14, match: new RegExp(/^[a-z0-9_-]{5,14}$/, "i")})
  username!: string;

  @prop({ unique: true, required: true, validate: [validator.isEmail] })
  mail!: string;

  @prop({required: true})
  hash!: string;

  @prop({required: true, default: {}})
  tokens!: { client: string, accessToken: { token: string, iat: string }, refreshToken: { token: string, iat: string } }[];

  // Not actually a database property, just for basic sessions tracking
  client_id?: string

  @prop({ ref: () => Book , default: []})
  borrowedBooks!: Ref<Book>[];

  @prop({ ref: () => Book , default: []})
  donatedBooks!: Ref<Book>[];

  @prop()
  createdAt!: Date;

  @prop()
  updatedAt!: Date;

}