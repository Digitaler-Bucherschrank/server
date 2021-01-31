import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { User } from "./User";

@Entity()
export class LogEntry {
    @PrimaryKey()
    _id: ObjectId;

    @Property()
    timestamp: Date

    @Property()
    ip_address: String;

    @ManyToOne()
    user: User;
}