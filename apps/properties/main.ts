import { NestFactory } from '@nestjs/core';
import { PropertiesModule } from './src/properties.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(PropertiesModule);
  app.use(cookieParser()); 
  app.enableCors({
    origin: '*', 
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }));
  await app.listen(3003, '0.0.0.0');
}
bootstrap();
