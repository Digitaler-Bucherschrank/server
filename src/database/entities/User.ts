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

  @prop({ unique: true })
  username!: string;

  @prop({ unique: true })
  mail!: string;

  @prop()
  hash!: string;

  @prop()
  tokens!: { client: string, accessToken: { token: string, iat: string }, refreshToken: { token: string, iat: string } }[];

  // Not actually a database property, just for basic sessions tracking
  client_id?: string;

  @prop({ ref: () => Book })
  borrowedBooks?: Ref<Book>[];

  @prop({ ref: () => Book })
  donatedBooks?: Ref<Book>[];

  @prop()
  createdAt!: Date;

  @prop()
  updatedAt!: Date;

}