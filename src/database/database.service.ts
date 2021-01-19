import { Injectable } from '@nestjs/common';
import { DatabaseConnectionInterface } from './databaseconnection.interface';
import { DatabaseConnectionMongoDB } from './databaseconnection.mongodb';

@Injectable()
export class DatabaseService {
    private DBConnection: DatabaseConnectionInterface = new DatabaseConnectionMongoDB;
    create(): DatabaseConnectionInterface {
        return this.DBConnection;
    }
}
