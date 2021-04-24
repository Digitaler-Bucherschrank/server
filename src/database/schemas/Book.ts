import { BookCase } from "./BookCase";
import { User } from "./User";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
// TODO: property Titlebild
@modelOptions({ schemaOptions: { collection: "books", timestamps: true } })
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
 //2 possibilities: gbookid required -> /donateBookmanual createbook.gbookid === null 
  @prop({required:false})
  gbookid!: string;
  
  @prop({required:true})
  ISBN!: string;
  
  @prop({required:true})
  author!: string;

  @prop({required:true})
  title!: string;
  
  @prop()
  subtitle!: string;
  
  @prop()
  thumbnail!: string;

  @prop({ ref: () => User , required: false})
  donor!: Ref<Book>;

  @prop({ ref: () => BookCase , required: false})
  location!: Ref<BookCase>;

  @prop()
  createdAt!: Date;

  @prop()
  updatedAt!: Date;
}