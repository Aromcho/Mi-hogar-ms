import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './src/gateway.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(4000);
  console.log('🚀 API Gateway escuchando en http://localhost:4000');
}
bootstrap();
