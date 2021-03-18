import { Inject, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';
import { FetcherModule } from './fetcher/fetcher.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CustomNamingStrategy } from './database/entities/CustomNamingStrategy';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
/**
 *  !! important, if you fork this project !!
 *  Delivers database credentials over a credentials.json in the same directory as this service
 */
const credentials = require('./credentials');

// TODO: Authentifizierung hinzufügen (siehe NestJS Dokumentation)
@Module({
  imports: [DatabaseModule, ApiModule, FetcherModule,
    MikroOrmModule.forRoot({
        entities: ['./dist/database/entities'],
        entitiesTs: ['./src/database/entities'],
        type: 'mongo',
        clientUrl: credentials.connection_string,
        namingStrategy: CustomNamingStrategy,
        autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
