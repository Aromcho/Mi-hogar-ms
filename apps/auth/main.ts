import { NestFactory } from '@nestjs/core';
import { AuthModule } from './src/auth.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {logger: ['log', 'debug', 'error', 'warn'],});
  app.use(cookieParser());
  await app.listen(3002, '0.0.0.0');
}
bootstrap();
