import { DatabaseConnectionInterface } from "./databaseconnection.interface";

export class DatabaseConnectionMongoDB implements DatabaseConnectionInterface {
    connect(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}