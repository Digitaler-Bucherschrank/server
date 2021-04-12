import { User } from "./User";
import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { collection: "logs" } })
export class LogEntry implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({required:true})
  timestamp!: Date;

  @prop()
  ip_address?: string;

  @prop({ ref: () => User })
  user!: Ref<User>;
}