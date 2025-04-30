import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './src/gateway.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(morgan('dev'));
  app.enableCors({
    origin: '*',
  });
  await app.listen(4000);
  console.log('🚀 API Gateway escuchando en http://localhost:4000');
}
bootstrap();
