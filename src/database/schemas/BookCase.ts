import { Book } from './Book';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { modelOptions, plugin, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

@plugin(autopopulate as any)
@modelOptions({
  schemaOptions: { collection: 'bookshelfs', validateBeforeSave: false },
})
export class BookCase implements Base {
  public _id: Types.ObjectId;
  public id: string;

  @prop()
  address!: string;

  @prop({ ref: () => Book, default: [], autopopulate: { maxDepth: 1 } })
  inventory!: Ref<Book>[];

  @prop({ required: true })
  title!: string;

  @prop()
  bcz?: string;

  @prop()
  comment?: string;

  @prop()
  contact!: string;

  @prop()
  deactivated?: boolean;

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
