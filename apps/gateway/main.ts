import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './src/gateway.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.use(cookieParser()); 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(morgan('dev'));
  app.enableCors({
    origin: "http://localhost:5005",
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();