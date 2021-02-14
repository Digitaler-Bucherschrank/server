import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { BookCase } from "./BookCase";
import { User } from "./User";

@Entity()
export class Book {
    @PrimaryKey()
    _id: ObjectId;

    @Property()
    gbookid!: String;

    @Property()
    author!: String;

    @Property()
    title!: String;

    @OneToOne(() => User)
    donor: User;

    @ManyToOne()
    location!: BookCase;

}