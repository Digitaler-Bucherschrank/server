export interface DatabaseConnectionInterface {
    connect(): Promise<boolean>;
}