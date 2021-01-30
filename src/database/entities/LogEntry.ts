import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

@Entity()
export class LogEntry {
    @PrimaryKey()
    _id: ObjectId;
    // TODO: Add LogEntry properties

}