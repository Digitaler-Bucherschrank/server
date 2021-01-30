import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';
import { FetcherModule } from './fetcher/fetcher.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CustomNamingStrategy } from './database/entities/CustomNamingStrategy';

@Module({
  imports: [DatabaseModule, ApiModule, FetcherModule,
    MikroOrmModule.forRoot({
        entities: ['./dist/database/entities'],
        entitiesTs: ['./src/database/entities'],
        type: 'mongo',
        clientUrl: 'mongodb+srv://admin:kappa@digitechnikum01.df4rp.mongodb.net/bücherschrank_db?retryWrites=true&w=majority',
        namingStrategy: CustomNamingStrategy,
        autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
