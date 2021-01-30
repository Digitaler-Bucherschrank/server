import { AbstractNamingStrategy } from "@mikro-orm/core";

// This NamingStrategy is for MikroORM, so the library knows what collection to assign to which entity
export class CustomNamingStrategy extends AbstractNamingStrategy {

    classToTableName(entityName: string): string {
        if(entityName == "BookCase"){
            return "bookshelfs"
        } else if(entityName == "Book"){
            return "books"
        } else if(entityName == "User"){
            return "users"
        } else {
            return entityName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }
    }

    joinColumnName(propertyName: string): string {
        return propertyName;
    }

    joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
        return entityName;
    }

    joinTableName(sourceEntity: string, targetEntity: string, propertyName: string): string {
        return '';
    }

    propertyToColumnName(propertyName: string): string {
        return propertyName;
    }

    referenceColumnName(): string {
        return '_id';
    }

}