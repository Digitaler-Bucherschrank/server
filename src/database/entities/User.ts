import { Collection, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Book } from "./Book";

@Entity()
export class User {
    @PrimaryKey()
    _id: ObjectId;

    @Property()
    username!: string

    @Property()
    mail!: string

    @Property()
    hash?: string

    @Property()
    tokens!: {client: string, token: string}[]

    @Property()
    client_id?: string

    @ManyToOne(() => Book)
    borrowedBooks? = new Collection<Book>(this)

    @ManyToOne(() => Book)
    donatedBooks? = new Collection<Book>(this)

    @Property()
    createdAt!: Date
}