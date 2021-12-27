import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { DatabaseModule } from "./database/database.module";
import { ApiModule } from "./api/api.module";
import { FetcherModule } from "./fetcher/fetcher.module";
import { AuthModule } from "./auth/auth.module";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { StatusInterceptor } from "./status/status.interceptor";
import { ConfigModule } from "@nestjs/config";


// TODO: Authentifizierung hinzufügen (siehe NestJS Dokumentation)
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
    }),
    DatabaseModule, ApiModule, FetcherModule,
    TypegooseModule.forRoot(process.env.DB_CONN_STR),
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusInterceptor,
    },
  ]
})
export class AppModule {
}
