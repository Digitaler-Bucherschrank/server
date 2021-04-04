import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Book } from "./Book";

@Entity()
export class BookCase {
    @PrimaryKey()
    _id: ObjectId;

    @Property()
    address!: string;

    @Property()
    bcz?: string;

    @Property()
    comment?: string;

    @Property()
    contact!: string;

    @Property()
    deactivated?: Boolean;

    @Property()
    deactreason?: string;

    @Property()
    digital?: boolean;

    @Property()
    entrytype?: string;

    @Property()
    homepage?: string;

    @Property()
    lat!: string;

    @Property()
    long!: string;

    @Property()
    open?: string;

    @Property()
    title!: string;

    @Property()
    type?: string;

    @OneToMany('Book', 'location')
    books!: Book[]
}