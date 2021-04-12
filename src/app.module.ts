import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { DatabaseModule } from "./database/database.module";
import { ApiModule } from "./api/api.module";
import { FetcherModule } from "./fetcher/fetcher.module";
import { AuthModule } from "./auth/auth.module";
import { Config } from "./config";
import { TypegooseModule } from "nestjs-typegoose";

/**
 *  !! important, if you fork this project !!
 *  Delivers database credentials over a config.ts in the same directory as this service
 */
// TODO: Authentifizierung hinzufügen (siehe NestJS Dokumentation)
@Module({
  imports: [DatabaseModule, ApiModule, FetcherModule,
    TypegooseModule.forRoot(Config.connection_string, {
      useNewUrlParser: true
    }),
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule {
}
