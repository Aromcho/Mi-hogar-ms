import { NestFactory } from '@nestjs/core';
import { AuthModule } from './src/auth.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {logger: ['log', 'debug', 'error', 'warn'],});
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5005', // o el frontend real
    credentials: true,
  });
  await app.listen(3002, '0.0.0.0');
}
bootstrap();
