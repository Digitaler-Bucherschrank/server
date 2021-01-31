import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Book } from "./Book";

@Entity()
export class User {
    @PrimaryKey()
    _id: ObjectId;

    @Property()
    username: String

    @Property()
    mail: String

    @Property()
    passwordhash: String

    @ManyToOne()
    borrowedBooks: Book[]

    @ManyToOne()
    donatedBooks: Book[]

    @Property()
    createdAt: Date
}