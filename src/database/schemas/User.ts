import { Book } from "./Book";
import { DocumentType, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { collection: "users" , timestamps: true} })
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

  @prop({ unique: true , required: true})
  username!: string;

  @prop({ unique: true , required: true})
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