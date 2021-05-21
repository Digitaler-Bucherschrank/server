import { Book } from "./Book";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";


@modelOptions({ schemaOptions: { collection: "bookshelfs", validateBeforeSave: false } })
export class BookCase implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  address!: string;
  
  @prop({ ref: () => Book , default: []})
  inventory!: Ref<Book>[];
  
  @prop({required:true})
  title!: string;

  @prop()
  bcz?: string;

  @prop()
  comment?: string;

  @prop()
  contact!: string;

  @prop()
  deactivated?: Boolean;

  @prop()
  deactreason?: string;

  @prop()
  digital?: boolean;

  @prop()
  entrytype?: string;

  @prop()
  homepage?: string;

  @prop()
  lat!: string;

  @prop()
  long!: string;

  @prop()
  open?: string;

  

  @prop()
  type?: string;

  @prop()
  updatedAt!: Date;
}