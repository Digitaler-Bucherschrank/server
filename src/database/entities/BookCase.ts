import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Book } from "./Book";

@Entity()
export class BookCase {
    @PrimaryKey()
    _id: ObjectId;

    @Property()
    address!: String;

    @Property()
    bcz?: String;

    @Property()
    comment?: String;

    @Property()
    contact!: String;

    @Property()
    deactivated?: Boolean;

    @Property()
    deactreason?: String;

    @Property()
    digital?: boolean;

    @Property()
    entrytype?: String;

    @Property()
    homepage?: String;

    @Property()
    lat!: String;

    @Property()
    long!: String;

    @Property()
    open?: String;

    @Property()
    title!: String;

    @Property()
    type?: String;

    @OneToMany('Book', 'location')
    books!: Book[]
}