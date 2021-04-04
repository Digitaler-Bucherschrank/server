import { Inject, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';
import { FetcherModule } from './fetcher/fetcher.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CustomNamingStrategy } from './database/entities/CustomNamingStrategy';
import { AuthModule } from './auth/auth.module';
import { Config } from "./config";
/**
 *  !! important, if you fork this project !!
 *  Delivers database credentials over a config.ts in the same directory as this service
 */
// TODO: Authentifizierung hinzufügen (siehe NestJS Dokumentation)
@Module({
  imports: [DatabaseModule, ApiModule, FetcherModule,
    MikroOrmModule.forRoot({
        entities: ['./dist/database/entities'],
        entitiesTs: ['./src/database/entities'],
        type: 'mongo',
        clientUrl: Config.connection_string,
        namingStrategy: CustomNamingStrategy,
        autoLoadEntities: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
