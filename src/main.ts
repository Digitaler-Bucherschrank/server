import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.getHttpAdapter().getInstance().set('trust proxy', true);
  await app.listen(3000);
}

bootstrap();
