import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('fdapi');
  const configService = app.get(ConfigService);
  const port = await configService.get('env.appPort');
  await app.listen(port);
  console.log('=====app start at======', port);
}
bootstrap();
